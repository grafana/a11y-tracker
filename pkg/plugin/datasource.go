package plugin

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/ckbedwell/grafana-a11y/pkg/models"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
)

const AppID = `ckbedwell-a11y-datasource` // same as plugin.json#id

func NewDatasource(ctx context.Context, settings backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
	httpClient := &http.Client{
		Timeout: 30 * time.Second,
	}

	return &Datasource{
		apiKey:     settings.DecryptedSecureJSONData["apiKey"],
		httpClient: httpClient,
	}, nil
}

type Datasource struct {
	apiKey     string
	httpClient *http.Client
}

func (d *Datasource) QueryData(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	// create response struct
	response := backend.NewQueryDataResponse()
	var e error = nil

	// loop over queries and execute them individually.
	for _, q := range req.Queries {
		to := q.TimeRange.To.Format(time.RFC3339)
		from := q.TimeRange.From.Format(time.RFC3339)
		issueQueryOptions := parseIssueQueryoptions(q)
		dateField := "created"
		queriesParam := []string{
			fmt.Sprintf("repo:%s", issueQueryOptions.Project),
		}

		if q.QueryType == "issues_closed" {
			dateField = "closed"
			queriesParam = append(queriesParam, "state:closed")
		}

		if q.QueryType == "issues_open" {
			queriesParam = append(queriesParam, "state:open")
		}

		queriesParam = append(queriesParam,
			fmt.Sprintf("%s:%s..%s", dateField, from, to))

		issues, err := d.getAllIssues(queriesParam)
		if err != nil {
			e = err
		}

		issuesDataFrames := toIssuesDataFrames(issues, q.QueryType)
		response.Responses[q.RefID] = toDataResponse(issuesDataFrames)
	}

	if e != nil {
		log.DefaultLogger.Error("QueryData error", e)
	}

	return response, e
}

func parseIssueQueryoptions(query backend.DataQuery) models.IssuesQueryOptions {
	var options models.IssuesQueryOptions
	err := json.Unmarshal(query.JSON, &options)
	if err != nil {
		log.DefaultLogger.Error("parseJSONoptions error", err)
	}

	return options
}

func toDataResponse(frames data.Frames) backend.DataResponse {
	return backend.DataResponse{
		Frames:      frames,
		Error:       nil,
		Status:      backend.Status(200),
		ErrorSource: backend.ErrorSourceDownstream,
	}
}

func (d *Datasource) doRequest(request *http.Request) ([]byte, http.Header, error) {
	res, err := d.httpClient.Do(request)

	if err != nil {
		return nil, nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, nil, err
	}

	return body, res.Header, nil
}

func (d *Datasource) createRequest(url string) (*http.Request, error) {
	request, err := http.NewRequest(http.MethodGet, url, nil)

	if err != nil {
		log.DefaultLogger.Error("Making request", err)
		return request, err
	}

	request.Header.Set("Accept", "application/vnd.github+json")
	request.Header.Set("Authorization", fmt.Sprintf("Bearer %s", d.apiKey))
	request.Header.Set("X-GitHub-Api-Version", "2022-11-28")

	return request, err
}

func (d *Datasource) CheckHealth(ctx context.Context, req *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	request, err := d.createRequest("https://api.github.com/repos/grafana/grafana/issues?state=all&labels=type/accessibility")
	if err != nil {
		return &backend.CheckHealthResult{
			Status:  backend.HealthStatusError,
			Message: `Failed to construct request`,
		}, err
	}

	res, _, err := d.doRequest(request)

	if err != nil {
		log.DefaultLogger.Error("CheckHealth", res)

		return &backend.CheckHealthResult{
			Status:  backend.HealthStatusError,
			Message: `Datasource is NOT working`,
		}, err
	}

	return &backend.CheckHealthResult{
		Status:  backend.HealthStatusOk,
		Message: `Datasource is working`,
	}, nil
}
