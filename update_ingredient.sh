#!/usr/bin/env bash
# AUTHOR:   manawasp
# MAIL:     clovis.kyndt@gmail.com
# FILE:     test.sh
# ROLE:     TODO (some explanation)
# CREATED:  2014-11-14 08:00:36
# MODIFIED: 2014-11-15 05:56:11

curl -X PATCH -H "Content-Type: application/json" -H "Auth-Token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU0NjY3MzljMWNmYWMwMWQxNjAwMDAwNiIsInNhbHQiOiJmMWYzZTE5NDgwMGQ2OGEwMGFmZDYzMDUzZjE3YmI0MSIsImFjY2VzcyI6WyJjb25zdW1lciIsInN1cHBsaWVyIiwiZ2FzdHJvbm9taXN0IiwiYWRtaW4iXSwiaWF0IjoxNDE2MDAwNDEyfQ.VzvbaDm8on_s66ysAjqhkce-c3dgQ4LMhimmcD10kGQ" -d '{"name":"chocolat","labels": ["dessert", "sucree"]}' http://localhost:8080/ingredients/546676d17d4469fa20000006
echo ''
