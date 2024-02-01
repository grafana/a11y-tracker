package plugin

import (
	"fmt"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"sync"

	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

type Result struct {
	Page  int
	Items []byte
}

func (d *Datasource) getAllSpeedy(baseURL string, queriesParam []string) ([][]byte, error) {
	url := constructURL(baseURL, queriesParam, 1)

	request, err := d.createRequest(url)
	if err != nil {
		return nil, err
	}

	body, headers, err := d.doRequest(request)
	if err != nil {
		return nil, err
	}

	linkHeader := headers.Get("Link")
	url = getURLFromLinkHeader(linkHeader, `last`)

	if url == "" {
		return [][]byte{body}, nil
	}

	lastPage, err := extractParamFromURL(url, `page`)
	if err != nil {
		return nil, err
	}

	asNumber, err := strconv.Atoi(lastPage)
	if err != nil {
		return nil, err
	}

	results := make([][]byte, asNumber)
	results[0] = body
	var waitingGroup sync.WaitGroup
	waitingGroup.Add(asNumber - 1)

	for i := 2; i <= asNumber; i++ {
		go func(page int) {
			defer waitingGroup.Done()

			url := constructURL(baseURL, queriesParam, page)
			log.DefaultLogger.Info(`url`, url)
			request, err := d.createRequest(url)
			if err != nil {
				log.DefaultLogger.Error("Creating request", url, err)
				return
			}

			body, _, err := d.doRequest(request)
			if err != nil {
				log.DefaultLogger.Error("Doing request", url, err)
				return
			}

			results[page-1] = body
		}(i)
	}

	waitingGroup.Wait()
	log.DefaultLogger.Info(`URL AND RESULTS`, url, results)

	n := 0
	for _, x := range results {
		if x != nil {
			results[n] = x
			n++
		}
	}
	results = results[:n]
	log.DefaultLogger.Info(`FITLERED`, results)

	return results, nil
}

func extractParamFromURL(inputURL string, param string) (string, error) {
	u, err := url.Parse(inputURL)
	if err != nil {
		return "", err
	}

	params := u.Query()
	return params.Get(param), nil
}

// TODO: handle - what if there are 1000s of pages for pagination?
// TODO: look into worker pool / waiting group
func (d *Datasource) getAll(baseURL string, queriesParam []string) ([][]byte, error) {
	url := constructURL(baseURL, queriesParam, 1)
	var items [][]byte

	for {
		log.DefaultLogger.Info(`url`, url)
		request, err := d.createRequest(url)
		if err != nil {
			return nil, err
		}

		body, headers, err := d.doRequest(request)
		if err != nil {
			return nil, err
		}

		items = append(items, body)

		linkHeader := headers.Get("Link")
		url = getURLFromLinkHeader(linkHeader, `next`)
		if url == "" {
			break
		}
	}

	return items, nil
}

func constructURL(baseURL string, queriesParam []string, page int) string {
	params := []string{
		"per_page=100",
		fmt.Sprintf("q=%s", strings.Join(queriesParam, `+`)),
		fmt.Sprintf("page=%d", page),
	}

	return fmt.Sprintf("%s?%s", baseURL, strings.Join(params, `&`))
}

func getURLFromLinkHeader(linkHeader string, position string) string {
	links := strings.Split(linkHeader, ",")
	var nextURL string

	for _, link := range links {
		if strings.Contains(link, fmt.Sprintf(`rel="%s"`, position)) {
			nextURL = getURL(link)
			break
		}
	}

	return nextURL
}

func getURL(link string) string {
	re := regexp.MustCompile(`<(.*)>`)
	matches := re.FindStringSubmatch(link)
	return matches[1]
}
