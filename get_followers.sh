#!/usr/bin/env bash
# AUTHOR:   manawasp
# MAIL:     clovis.kyndt@gmail.com
# FILE:     test.sh
# ROLE:     TODO (some explanation)
# CREATED:  2014-11-14 08:00:36
# MODIFIED: 2014-11-14 22:59:46

curl -H "Auth-Token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU0NjVlNGEwZjUzZGE5MTMzNjAwMDAwNyIsInNhbHQiOiI2NDM2MTMwNGNiOGNiZTNkMDk5ZjI1OTM2NTUyMDU0YSIsImlhdCI6MTQxNTk2MzgwOH0.mn-xNxO8sIB2rfpOABj3a3ZNrroJR8I3Vxr9dQW6djE" -X GET http://localhost:8080/followers/5465e4a0f53da91336000007
echo ''
