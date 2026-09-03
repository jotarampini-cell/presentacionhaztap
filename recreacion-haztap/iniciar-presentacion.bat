@echo off
echo ===================================================
echo   Iniciando Servidor Local para Presentacion Haztap
echo ===================================================
echo.
echo La presentacion se abrira en tu navegador automaticamente.
echo Por favor, NO CIERRES esta ventana negra mientras estes presentando.
echo.
start http://localhost:8000/preview.html
python -m http.server 8000
