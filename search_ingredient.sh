#!/usr/bin/env bash
# AUTHOR:   manawasp
# MAIL:     clovis.kyndt@gmail.com
# FILE:     test.sh
# ROLE:     TODO (some explanation)
# CREATED:  2014-11-14 08:00:36
# MODIFIED: 2014-11-15 23:00:31

curl -X POST -H "Content-Type: application/json" -H "Auth-Token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU0NjY3MzljMWNmYWMwMWQxNjAwMDAwNiIsInNhbHQiOiJmMWYzZTE5NDgwMGQ2OGEwMGFmZDYzMDUzZjE3YmI0MSIsImFjY2VzcyI6WyJjb25zdW1lciIsInN1cHBsaWVyIiwiZ2FzdHJvbm9taXN0IiwiYWRtaW4iXSwiaWF0IjoxNDE2MDAwNDEyfQ.VzvbaDm8on_s66ysAjqhkce-c3dgQ4LMhimmcD10kGQ" -d '{"blacklist": ["musulman"]}' http://localhost:8080/ingredients/search
echo ''
