#!/usr/bin/env bash
# AUTHOR:   manawasp
# MAIL:     clovis.kyndt@gmail.com
# FILE:     test.sh
# ROLE:     TODO (some explanation)
# CREATED:  2014-11-14 08:00:36
# MODIFIED: 2014-11-14 21:57:06

curl -H "Auth-Token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU0NjVlOTE0NTc1NmE4ODg0NDAwMDAwNyIsInNhbHQiOiIzM2I0NjVmMjMzZDAxOTYxNTNhYmRlMWU4NzdlMzUzMyIsImlhdCI6MTQxNTk2NDk0OH0.eGg2hZlmPMUXXOJug5Fs88G16KthpSRIOCQi3DvbWGU" -X GET http://localhost:8080/users/5465e4a0f53da91336000007
echo ''
