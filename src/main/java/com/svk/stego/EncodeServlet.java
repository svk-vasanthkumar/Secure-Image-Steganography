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

@WebServlet("/encode")
@MultipartConfig
public class EncodeServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        try {
            // 1️⃣ Get form data
            String message = request.getParameter("message");
            String password = request.getParameter("password");
            Part imagePart = request.getPart("image");

            // 2️⃣ Read uploaded image
            BufferedImage image = ImageIO.read(imagePart.getInputStream());

            // 3️⃣ Encrypt message using password
            String encryptedMessage = AESUtil.encrypt(message, password);

            // 4️⃣ Hide encrypted message inside image
            BufferedImage encodedImage =
                    SteganographyUtil.encode(image, encryptedMessage);

            // 5️⃣ Send encoded image as download
            response.setContentType("image/png");
            response.setHeader(
                    "Content-Disposition",
                    "attachment; filename=encoded.png"
            );

            ImageIO.write(encodedImage, "png", response.getOutputStream());

        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().println("Error during encoding");
        }
    }
}
