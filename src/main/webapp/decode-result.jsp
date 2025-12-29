<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <title>Decoded Message</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="header">
    <h1>🔓 Decode Result<span class="cursor">_</span></h1>
    <p>Cyber Security | Steganography</p>
</div>

<div class="card">
    <h2>Result</h2>

   <%
String res = (String) request.getAttribute("result");
boolean isError = res != null && res.contains("ACCESS DENIED");
%>

<p class="<%= isError ? "result-error" : "result-success" %>">
    <%= res %>
</p>
   

    <a class="link" href="decode.html">Decode Another Image</a>
</div>

<div class="footer">
    <p>👨‍💻 Developed by <b>Vasanthkumar (SVK)</b></p>
    <p>⚠ For Educational & Ethical Use Only</p>
</div>

</body>
</html>
