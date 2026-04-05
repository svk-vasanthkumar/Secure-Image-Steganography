// ===== ENCODE =====
const encodeForm = document.getElementById("encodeForm");

if (encodeForm) {
    encodeForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const button = encodeForm.querySelector("button");
        button.innerText = "Processing...";

        const file = encodeForm.querySelector('input[name="image"]').files[0];
        const message = encodeForm.querySelector('textarea[name="message"]').value;
        const password = encodeForm.querySelector('input[name="password"]').value;

        const formData = new FormData();
        formData.append("image", file);
        formData.append("message", message);
        formData.append("password", password);

        try {
            const res = await fetch("https://secure-image-steganography-backend.onrender.com", {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Encoding failed");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "encoded.png";
            a.click();
            window.URL.revokeObjectURL(url);

            button.innerText = "Done ✅";
        } catch (err) {
            alert(err.message || "Encoding failed ❌");
            button.innerText = "Encode & Download";
        }
    });
}

// ===== DECODE =====
const decodeForm = document.getElementById("decodeForm");

if (decodeForm) {
    decodeForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const button = decodeForm.querySelector("button");
        button.innerText = "Decoding...";

        const file = decodeForm.querySelector('input[name="image"]').files[0];
        const password = decodeForm.querySelector('input[name="password"]').value;

        const formData = new FormData();
        formData.append("image", file);
        formData.append("password", password);

        try {
            const res = await fetch("https://secure-image-steganography-backend.onrender.com", {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Decoding failed");
            }

            const box = document.getElementById("resultBox");
            const text = document.getElementById("resultText");

            text.innerText = data.message;
            box.classList.remove("hidden");

            button.innerText = "Done ✅";

        } catch (err) {
            alert(err.message || "Decoding failed ❌");
            button.innerText = "Decode Message";
        }
    });
}

// COPY FUNCTION
function copyMessage() {
    const text = document.getElementById("resultText").innerText;
    navigator.clipboard.writeText(text);
    alert("Copied ✅");
}