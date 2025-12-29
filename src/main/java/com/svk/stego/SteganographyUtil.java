package com.svk.stego;

import java.awt.image.BufferedImage;

public class SteganographyUtil {

    // ===== ENCODE =====
    public static BufferedImage encode(BufferedImage image, String message) {

        byte[] msg = message.getBytes();
        int msgLen = msg.length;

        int width = image.getWidth();
        int height = image.getHeight();

        int x = 0, y = 0;

        // store length (32 bits)
        for (int i = 31; i >= 0; i--) {
            int bit = (msgLen >> i) & 1;
            int pixel = image.getRGB(x, y);
            int blue = (pixel & 0xFF);
            blue = (blue & 0xFE) | bit;
            image.setRGB(x, y, (pixel & 0xFFFFFF00) | blue);

            x++;
            if (x == width) { x = 0; y++; }
        }

        // store message
        for (byte b : msg) {
            for (int i = 7; i >= 0; i--) {
                int bit = (b >> i) & 1;
                int pixel = image.getRGB(x, y);
                int blue = (pixel & 0xFF);
                blue = (blue & 0xFE) | bit;
                image.setRGB(x, y, (pixel & 0xFFFFFF00) | blue);

                x++;
                if (x == width) { x = 0; y++; }
            }
        }
        return image;
    }

    // ===== DECODE =====
    public static String decode(BufferedImage image) {

        int width = image.getWidth();
        int height = image.getHeight();
        int totalPixels = width * height;

        int x = 0, y = 0;
        int msgLen = 0;

        // read length
        for (int i = 0; i < 32; i++) {
            if (y >= height) return "Invalid image";

            int pixel = image.getRGB(x, y);
            int bit = (pixel & 0xFF) & 1;
            msgLen = (msgLen << 1) | bit;

            x++;
            if (x == width) { x = 0; y++; }
        }

        if (msgLen * 8 > totalPixels - 32)
            return "Invalid or corrupted image";

        byte[] msg = new byte[msgLen];

        for (int i = 0; i < msgLen; i++) {
            int b = 0;
            for (int j = 0; j < 8; j++) {
                if (y >= height) return "Invalid image";

                int pixel = image.getRGB(x, y);
                int bit = (pixel & 0xFF) & 1;
                b = (b << 1) | bit;

                x++;
                if (x == width) { x = 0; y++; }
            }
            msg[i] = (byte) b;
        }
        return new String(msg);
    }
}
