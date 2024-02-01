package plugin

import (
	"fmt"
	"testing"
)

func TestExtractParamFromURL(t *testing.T) {
	lastPage, _ := extractParamFromURL(`https://api.github.com/search/issues?per_page=100&q=is%3Aissue+label%3Atype%2Faccessibility+repo%3Agrafana%2Fgrafana&page=4`, `page`)
	fmt.Println(lastPage)
}

func TestGoRoutineExample(t *testing.T) {
	s := []string{"a", "b", "c", "d", "e", "f", "g", "h"}
	fmt.Println(s[:5-1])
}
