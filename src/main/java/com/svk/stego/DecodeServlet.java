package com.svk.stego;

import java.awt.image.BufferedImage;
import java.io.IOException;

import javax.imageio.ImageIO;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;

@WebServlet("/decode")
@MultipartConfig
public class DecodeServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 1️⃣ Get uploaded image & password
        Part imagePart = request.getPart("image");
        String password = request.getParameter("password");

        String resultMessage;

        try {
            // 2️⃣ Read image
            BufferedImage image = ImageIO.read(imagePart.getInputStream());

            // 3️⃣ Extract encrypted message from image
            String encryptedMessage = SteganographyUtil.decode(image);

            // 4️⃣ Decrypt using password
            resultMessage = AESUtil.decrypt(encryptedMessage, password);

        } catch (Exception e) {
            // 5️⃣ Wrong password or corrupted image
            resultMessage = "⚠ ACCESS DENIED : Wrong Password or Invalid Image";
        }

        // 6️⃣ Send result to JSP (same UI theme)
        request.setAttribute("result", resultMessage);
        request.getRequestDispatcher("decode-result.jsp")
               .forward(request, response);
    }
}
