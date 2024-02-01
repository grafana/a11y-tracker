package plugin

import (
	"encoding/json"
	"strings"
	"time"

	"github.com/ckbedwell/grafana-a11y/pkg/models"
	"github.com/ckbedwell/grafana-a11y/pkg/utils"
	"github.com/grafana/grafana-plugin-sdk-go/data"
)

type DateMap map[string]int64

func (d *Datasource) getAllIssues(queries []string) ([]models.Issue, error) {
	query := []string{
		"is:issue",
		"label:type/accessibility",
	}

	items, err := d.getAllSpeedy("https://api.github.com/search/issues", append(query, queries...))
	if err != nil {
		return nil, err
	}

	var issues []models.Issue

	for _, item := range items {
		var result models.SearchIssuesResponse
		err := json.Unmarshal(item, &result)

		if err != nil {
			return nil, err
		}

		issues = append(issues, result.Items...)
	}

	return issues, nil
}

func toIssuesDataFrames(res []models.Issue, queryType string) data.Frames {
	frame := data.NewFrame(
		queryType,
		data.NewField("title", nil, []string{}),
		data.NewField("createdAt", nil, []time.Time{}),
		data.NewField("closedAt", nil, []*time.Time{}),
		data.NewField("updatedAt", nil, []time.Time{}),
		data.NewField("author", nil, []string{}),
		data.NewField("state", nil, []string{}),
		data.NewField("labels", nil, []string{}),
		data.NewField("wcag level A", nil, []bool{}),
		data.NewField("wcag level AA", nil, []bool{}),
		data.NewField("wcag level AAA", nil, []bool{}),
		data.NewField("body", nil, []string{}),
		data.NewField("reactions", nil, []int64{}),
		data.NewField("duration", nil, []*int64{}),
	)

	for _, issue := range res {
		labels := []string{}

		for _, l := range issue.Labels {
			labels = append(labels, l.Name)
		}

		wcagLevel := getWCAGLevelConformance(issue.Labels, utils.WCAGConformanceMap)
		duration := getDuration(issue)

		frame.AppendRow(
			issue.Title,
			issue.CreatedAt,
			issue.ClosedAt,
			issue.UpdatedAt,
			issue.User.Login,
			issue.State,
			strings.Join(labels, `,`),
			wcagLevel.A,
			wcagLevel.AA,
			wcagLevel.AAA,
			issue.Body,
			issue.Reactions.TotalCount,
			duration,
		)
	}

	return data.Frames{frame}
}

func getDuration(issue models.Issue) *int64 {
	createdAt := issue.CreatedAt
	closedAt := issue.ClosedAt

	if closedAt == nil {
		return nil
	}

	duration := int64(closedAt.Sub(createdAt).Seconds() / 60 / 60 / 24)
	return &duration
}

type WCAGConformanceLevels struct {
	A   bool
	AA  bool
	AAA bool
}

func getWCAGLevelConformance(labels []models.Label, conformanceLevels utils.ConformanceMap) WCAGConformanceLevels {
	w := WCAGConformanceLevels{
		A:   false,
		AA:  false,
		AAA: false,
	}

	if labels == nil {
		return w
	}

	for _, label := range labels {
		if strings.Contains(label.Name, `wcag`) {
			refId := strings.Split(label.Name, `/`)[1]

			switch conformanceLevels[refId] {
			case `A`:
				w.A = true
			case `AA`:
				w.AA = true
			case `AAA`:
				w.AAA = true
			}
		}
	}

	return w
}
