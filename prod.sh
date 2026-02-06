yarn run build test
version=1.0.1

docker build -t 10.2.163.245:88/excel-comparison/excel-comparison-web:${version} .
docker push 10.2.163.245:88/excel-comparison/excel-comparison-web:${version}

curl -X POST http://10.0.253.50:9000/api/webhooks/4104ba97-9393-4163-8b71-8fdd7277f2dd \
-H "Content-Type: application/json" \
-d '{
  "action": "update",
  "service": "excel-comparison-web-stack_excel-comparison-web",
  "image": "10.2.163.245:88/excel-comparison/excel-comparison-web:${version}"
}'

rm -rf dist