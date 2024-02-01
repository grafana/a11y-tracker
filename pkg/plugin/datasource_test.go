package plugin

import (
	"fmt"
	"testing"
)

func TestNewDatasource(t *testing.T) {
	var s []string

	fmt.Println(s)
	foo(&s)
	fmt.Println(s)
}

func foo(s interface{}) {
	s = append(s.([]interface{}), "bar")
}
