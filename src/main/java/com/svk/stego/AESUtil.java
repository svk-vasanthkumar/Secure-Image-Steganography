package com.svk.stego;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class AESUtil {

    private static final String ALGO = "AES";

    private static SecretKeySpec getKey(String password) {
        byte[] key = new byte[16];
        byte[] pwdBytes = password.getBytes();
        for (int i = 0; i < 16 && i < pwdBytes.length; i++) {
            key[i] = pwdBytes[i];
        }
        return new SecretKeySpec(key, ALGO);
    }

    public static String encrypt(String data, String password) throws Exception {
        Cipher cipher = Cipher.getInstance(ALGO);
        cipher.init(Cipher.ENCRYPT_MODE, getKey(password));
        byte[] encrypted = cipher.doFinal(data.getBytes());
        return Base64.getEncoder().encodeToString(encrypted);
    }

    public static String decrypt(String data, String password) throws Exception {
        Cipher cipher = Cipher.getInstance(ALGO);
        cipher.init(Cipher.DECRYPT_MODE, getKey(password));
        byte[] decoded = Base64.getDecoder().decode(data);
        return new String(cipher.doFinal(decoded));
    }
}
