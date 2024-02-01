package utils

import (
	"testing"
)

func TestParsing(t *testing.T) {
	levels, _ := getConformanceLevels()
	writeConformanceMap(levels)
}
