package models

import "time"

type IssuesQueryOptions struct {
	Project string `json:"project"`
}

type SearchIssuesResponse struct {
	Items []Issue `json:"items"`
}

type Issue struct {
	Title     string     `json:"title"`
	CreatedAt time.Time  `json:"created_at"`
	ClosedAt  *time.Time `json:"closed_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	State     string     `json:"state"`
	User      User       `json:"user"`
	Labels    []Label    `json:"labels"`
	Body      string     `json:"body"`
	Reactions Reactions  `json:"reactions"`
}

type Reactions struct {
	URL        string `json:"url"`
	TotalCount int64  `json:"total_count"`
	PlusOne    int64  `json:"+1"`
	MinusOne   int64  `json:"-1"`
	Laugh      int64  `json:"laugh"`
	Hooray     int64  `json:"hooray"`
	Confused   int64  `json:"confused"`
	Heart      int64  `json:"heart"`
	Rocket     int64  `json:"rocket"`
	Eyes       int64  `json:"eyes"`
}

type User struct {
	Login string `json:"login"`
}

type Label struct {
	Name  string `json:"name"`
	Color string `json:"color"`
}
