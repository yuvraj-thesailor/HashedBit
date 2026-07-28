function countWords() {
    const text = document.getElementById("paragraph").value.trim();

    if (text === "") {
        document.getElementById("wordCount").textContent = 0;
        return;
    }

    // Split on spaces and filter out empty strings
    const words = text.split(/\s+/);
    document.getElementById("wordCount").textContent = words.length;
}
