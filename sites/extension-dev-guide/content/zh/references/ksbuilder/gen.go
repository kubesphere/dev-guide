package main

import (
	"fmt"
	"log"
	"path"
	"path/filepath"
	"strings"

	"github.com/kubesphere/ksbuilder/cmd"
	"github.com/spf13/cobra/doc"
)

func main() {
	ksbuilder := cmd.NewRootCmd("v1.0.0")

	standardLinks := func(s string) string {
		return "zh/references/ksbuilder/" + strings.TrimRight(s, ".md")
	}

	hdrFunc := func(filename string) string {
		base := filepath.Base(filename)
		name := strings.TrimSuffix(base, path.Ext(base))
		title := strings.Replace(name, "_", " ", -1)
		return fmt.Sprintf("---\ntitle: \"%s\"\n---\n\n", title)
	}

	err := doc.GenMarkdownTreeCustom(ksbuilder, "./", hdrFunc, standardLinks)
	if err != nil {
		log.Fatal(err)
	}
}
