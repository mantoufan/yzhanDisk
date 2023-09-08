#!/bin/bash
function green {
  echo -e "\x1b[32m$1\x1b[0m"
}
function red {
  echo -e "\x1b[31m$1\x1b[0m"
}
function blue {
  echo -e "\x1b[34m$1\x1b[0m"
}
# Store in S3 and Run in EC2
blue 'Step1: loading varibles from .env...'
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs -d '\n')
  green 'Find .env'
else
  red 'Cannot find .env'
  exit 1
fi

blue 'Step2: checking if first parameter id is set...'
if [ -z "$1" ]; then
  red 'First parameter id is required'
  exit 1
fi
id="$1"
green "id: ${id}"

blue 'Step3: querying DB for input_text and input_file_path...'
db_api_url="${REACT_APP_DB_API_URL}/items/${id}"
db_json=$(curl -s "$db_api_url")
input_text=$(echo "$db_json" | awk -F'"input_text":' '{print $2}' | awk -F'"' '{print $2}')
input_file_path=$(echo "$db_json" | awk -F'"input_file_path":' '{print $2}' | awk -F'"' '{print $2}')
green "input_text: $input_text"
green "input_file_path: $input_file_path"
input_file_url="${REACT_APP_S3_API_URL}/${input_file_path}"
input_file_name=$(basename "$input_file_path")

blue "Step4: Downloading input file from: $input_file_url"
curl -s -o "$input_file_name" "$input_file_url"

blue 'Step5: generating output file...'
output_file_name="${input_file_name%.*}.out.txt"
cat "$input_file_name" > "$output_file_name"
echo "$input_text" >> "$output_file_name"

blue 'Step6: uploading output file...'
upload_url="${REACT_APP_S3_API_URL}/${REACT_APP_S3_BUCKET_NAME}/${output_file_name}"
curl -s -T "$output_file_name" "$upload_url"

blue 'Step7: updating DB with output_file_path...'
output_file_path="${REACT_APP_S3_BUCKET_NAME}/${output_file_name}"
output_file_path_json="{\"output_file_path\":\"${output_file_path}\"}"
curl -X PATCH -H 'Content-Type: application/json' -d "$output_file_path_json" "$db_api_url" -o /dev/null 

green "Done!"

