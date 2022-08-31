package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"os"
	"strings"

	"github.com/kubesphere/ksbuilder/cmd"
	"github.com/spf13/cobra"
)

func main() {
	ksbuilder := cmd.NewRootCmd("v1.0.0")

	standardLinks := func(s string) string {
		return "zh/references/ksbuilder/" + strings.TrimRight(s, ".md")
	}
	f, err := os.Create("./_index.md")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	f.WriteString(`---
title: ksbuilder CLI reference
weight: 01
description:  ksbuilder 扩展组件打包、发布工具
---

{{< table_of_contents >}}

`)

	err = GenMarkdownTreeCustom(ksbuilder, f, standardLinks)
	if err != nil {
		log.Fatal(err)
	}
}

func GenMarkdownTreeCustom(cmd *cobra.Command, w io.Writer, linkHandler func(string) string) error {
	if err := GenMarkdownCustom(cmd, w, linkHandler); err != nil {
		return err
	}

	for _, c := range cmd.Commands() {
		if !c.IsAvailableCommand() || c.IsAdditionalHelpTopicCommand() {
			continue
		}
		if err := GenMarkdownTreeCustom(c, w, linkHandler); err != nil {
			return err
		}
	}
	return nil
}

func GenMarkdownCustom(cmd *cobra.Command, w io.Writer, linkHandler func(string) string) error {
	cmd.InitDefaultHelpCmd()
	cmd.InitDefaultHelpFlag()

	buf := new(bytes.Buffer)
	name := cmd.CommandPath()

	buf.WriteString("------\n\n")
	buf.WriteString("## " + name + "\n\n")
	buf.WriteString(cmd.Short + "\n\n")
	if len(cmd.Long) > 0 {
		buf.WriteString("### 简介\n\n")
		buf.WriteString(cmd.Long + "\n\n")
	}

	if cmd.Runnable() {
		buf.WriteString(fmt.Sprintf("```\n%s\n```\n\n", cmd.UseLine()))
	}

	if len(cmd.Example) > 0 {
		buf.WriteString("### 示例\n\n")
		buf.WriteString(fmt.Sprintf("```\n%s\n```\n\n", cmd.Example))
	}

	if err := printOptions(buf, cmd, name); err != nil {
		return err
	}
	_, err := buf.WriteTo(w)
	return err
}

func printOptions(buf *bytes.Buffer, cmd *cobra.Command, name string) error {
	flags := cmd.NonInheritedFlags()
	flags.SetOutput(buf)
	if flags.HasAvailableFlags() {
		buf.WriteString("### 可选项\n\n```\n")
		flags.PrintDefaults()
		buf.WriteString("```\n\n")
	}

	parentFlags := cmd.InheritedFlags()
	parentFlags.SetOutput(buf)
	if parentFlags.HasAvailableFlags() {
		buf.WriteString("### 从父命令继承的可选项\n\n```\n")
		parentFlags.PrintDefaults()
		buf.WriteString("```\n\n")
	}
	return nil
}
