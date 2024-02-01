package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
)

type WCAGDoc = []WCAGPrinciple

type WCAGPrinciple struct {
	RefID       string      `json:"ref_id"`
	Title       string      `json:"title"`
	Description string      `json:"description"`
	URL         string      `json:"url"`
	Guidelines  []Guideline `json:"guidelines"`
}

// Guideline represents a single guideline under a WCAG item.
type Guideline struct {
	RefID           string             `json:"ref_id"`
	Title           string             `json:"title"`
	Description     string             `json:"description"`
	URL             string             `json:"url"`
	References      []Reference        `json:"references"`
	SuccessCriteria []SuccessCriterion `json:"success_criteria"`
}

type SuccessCriterion struct {
	RefID        string        `json:"ref_id"`
	Title        string        `json:"title"`
	Description  string        `json:"description"`
	URL          string        `json:"url"`
	Level        string        `json:"level"`
	SpecialCases []SpecialCase `json:"special_cases"`
	Notes        []Note        `json:"notes"`
	References   []Reference   `json:"references"`
}

type SpecialCase struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Type        string `json:"type"`
}

type Note struct {
	Title string `json:"content"`
}

type Reference struct {
	Title string `json:"title"`
	URL   string `json:"url"`
}

type ConformanceMap map[string]string

func writeConformanceMap(conformanceMap ConformanceMap) error {
	file, err := os.Create("./conformance_map.go")
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = file.WriteString("// THIS IS AUTOMATICALLY GENERATED. IF YOU WANT TO UPDATE THIS FILE, UPDATE src/assets/wcag.json AND RUN make generate-conformance-map\n\npackage utils\n\nvar WCAGConformanceMap = ConformanceMap{\n")
	if err != nil {
		return err
	}

	for key, value := range conformanceMap {
		_, err = file.WriteString(fmt.Sprintf("\t\"%s\": \"%s\",\n", key, value))
		if err != nil {
			return err
		}
	}

	_, err = file.WriteString("}\n")
	if err != nil {
		return err
	}

	return nil
}

func getConformanceLevels() (ConformanceMap, error) {
	data, err := parseWCAGdata()

	if err != nil {
		return nil, err
	}

	WCAGConformanceMap := make(ConformanceMap)

	for _, principle := range data {
		for _, guideline := range principle.Guidelines {
			for _, criterion := range guideline.SuccessCriteria {
				WCAGConformanceMap[criterion.RefID] = criterion.Level
			}
		}
	}

	return WCAGConformanceMap, nil
}

func parseWCAGdata() (WCAGDoc, error) {
	jsonFile, err := os.Open("../../src/assets/wcag.json")
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer jsonFile.Close()

	byteValue, err := io.ReadAll(jsonFile)
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %w", err)
	}

	var data []WCAGPrinciple
	err = json.Unmarshal(byteValue, &data)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal JSON: %w", err)
	}

	return data, nil
}
