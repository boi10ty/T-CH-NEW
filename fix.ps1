$content = Get-Content "c:\Users\super\Downloads\tich-xanh-main\src\app\live\page.tsx" -Raw
$idx = $content.LastIndexOf("export default Index;")
if ($idx -gt 0) {
    $idx = $idx + "export default Index;".Length
    $newContent = $content.Substring(0, $idx)
    Set-Content "c:\Users\super\Downloads\tich-xanh-main\src\app\live\page.tsx" $newContent
    Write-Host "File cleaned successfully"
}
