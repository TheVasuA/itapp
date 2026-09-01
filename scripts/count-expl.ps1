$langs = 'mongodb','redis','cassandra','neo4j','elasticsearch','dynamodb','graphql','sparql','influxdb','promql','sql','mysql','postgresql','sqlite','mssql','oracle','mariadb'
foreach ($l in $langs) {
  $p = "src/content/$l/topics/index.js"
  if (Test-Path $p) {
    $c = Get-Content $p -Raw
    $notes = ([regex]::Matches($c, 'note:')).Count
    $expl = ([regex]::Matches($c, 'explanation:')).Count
    $lines = (Get-Content $p).Count
    Write-Output ("{0,-14} notes={1,-4} expl={2,-4} lines={3}" -f $l, $notes, $expl, $lines)
  } else {
    Write-Output ("{0,-14} MISSING" -f $l)
  }
}
