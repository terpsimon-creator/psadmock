/* PSAD redesign concept — small, dependency-free behaviours.
   Everything here is progressive enhancement: the pages read fine without it. */

(function () {
  "use strict";

  /* ---- Forms: set this once and every form on the site posts to it. ------
     Works with Formspree, Basin, Getform, or any endpoint that accepts a
     standard POST. While it is empty, forms open the visitor's email app
     with the answers filled in, addressed to the form's data-to address. */
  var FORM_ENDPOINT = "";

  var root = document.documentElement;

  /* ---- Larger text ------------------------------------------------------ */
  var textBtn = document.querySelector(".text-toggle");
  function setText(large) {
    if (large) root.setAttribute("data-text", "large"); else root.removeAttribute("data-text");
    if (textBtn) textBtn.setAttribute("aria-pressed", large ? "true" : "false");
  }
  try { setText(localStorage.getItem("psad-text") === "large"); } catch (e) {}
  if (textBtn) {
    textBtn.addEventListener("click", function () {
      var large = root.getAttribute("data-text") !== "large";
      setText(large);
      try { localStorage.setItem("psad-text", large ? "large" : "default"); } catch (e) {}
    });
  }

  /* ---- Mobile menu ------------------------------------------------------ */
  var menuBtn = document.querySelector(".menu-toggle");
  var nav = document.getElementById("nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.textContent = open ? "Close" : "Menu";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) menuBtn.click();
    });
  }

  /* ---- Home: the time rail ---------------------------------------------- */
  var rail = document.querySelector("[data-rail]");
  if (rail) {
    var buttons = [].slice.call(rail.querySelectorAll("button[data-img]"));
    var frame = document.querySelector(".rail-frame");
    var yearEl = document.querySelector(".rail-year");
    var capEl = document.querySelector(".rail-caption");
    var imgs = {};
    [].forEach.call(frame.querySelectorAll("img"), function (img) { imgs[img.getAttribute("src")] = img; });

    function show(btn) {
      var src = btn.getAttribute("data-img");
      if (!imgs[src]) {
        var img = new Image();
        img.src = src;
        img.alt = btn.getAttribute("data-alt") || "";
        frame.insertBefore(img, yearEl);
        imgs[src] = img;
        void img.offsetWidth; // let the fade run
      }
      Object.keys(imgs).forEach(function (k) {
        imgs[k].classList.toggle("is-active", k === src);
        imgs[k].alt = k === src ? (btn.getAttribute("data-alt") || "") : "";
      });
      yearEl.textContent = btn.getAttribute("data-year");
      capEl.textContent = btn.getAttribute("data-caption");
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
    }
    buttons.forEach(function (btn, i) {
      btn.addEventListener("click", function () { show(btn); });
      btn.addEventListener("keydown", function (e) {
        var next = e.key === "ArrowRight" ? buttons[i + 1] : e.key === "ArrowLeft" ? buttons[i - 1] : null;
        if (next) { e.preventDefault(); next.focus(); show(next); }
      });
    });
  }

  /* ---- History: photo lightbox ------------------------------------------ */
  var lightbox = document.querySelector("dialog.lightbox");
  if (lightbox && typeof lightbox.showModal === "function") {
    var big = lightbox.querySelector("img");
    var cap = lightbox.querySelector("p");
    document.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest("[data-zoom]") : null;
      if (!btn) return;
      var thumb = btn.querySelector("img");
      big.src = thumb.getAttribute("src");
      big.alt = thumb.getAttribute("alt") || "";
      cap.textContent = thumb.getAttribute("alt") || "";
      lightbox.showModal();
    });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) lightbox.close(); });
  }

  /* ---- Videos: load YouTube only when someone asks for it ---------------- */
  [].forEach.call(document.querySelectorAll(".video[data-youtube]"), function (box) {
    var id = box.getAttribute("data-youtube");
    var btn = box.querySelector("button");
    if (!btn) return;
    btn.style.backgroundImage = "linear-gradient(rgba(13,43,34,.35),rgba(13,43,34,.35)),url(https://i.ytimg.com/vi/" + id + "/hqdefault.jpg)";
    btn.addEventListener("click", function () {
      var frame = document.createElement("iframe");
      frame.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&cc_load_policy=1&rel=0";
      frame.title = box.getAttribute("data-title") || "Video";
      frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      frame.allowFullscreen = true;
      box.innerHTML = "";
      box.appendChild(frame);
    });
  });

  /* ---- Resources: filter by category ------------------------------------ */
  var filters = [].slice.call(document.querySelectorAll("[data-filter]"));
  if (filters.length) {
    var items = [].slice.call(document.querySelectorAll("[data-cat]"));
    var count = document.querySelector("[data-count]");
    filters.forEach(function (f) {
      f.addEventListener("click", function () {
        var want = f.getAttribute("data-filter");
        var shown = 0;
        items.forEach(function (it) {
          var on = want === "all" || it.getAttribute("data-cat") === want;
          it.hidden = !on;
          if (on) shown++;
        });
        filters.forEach(function (b) { b.setAttribute("aria-pressed", b === f ? "true" : "false"); });
        if (count) count.textContent = shown + (shown === 1 ? " listing" : " listings");
      });
    });
  }

  /* ---- Forms ------------------------------------------------------------- */
  [].forEach.call(document.querySelectorAll("form[data-to]"), function (form) {
    var status = form.querySelector(".form-status");
    function say(msg) { if (status) { status.hidden = false; status.textContent = msg; status.focus && status.focus(); } }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var subject = form.getAttribute("data-subject") || "Message from psadeaf.org";
      var done = form.getAttribute("data-done") || "Sent. Thank you!";

      if (FORM_ENDPOINT) {
        data.append("_subject", subject);
        fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function (r) {
            if (!r.ok) throw new Error();
            form.reset();
            say(done);
          })
          .catch(function () {
            say("That didn't send. Check your connection and try again, or email " + form.getAttribute("data-to") + ".");
          });
        return;
      }

      // No endpoint yet: hand the answers to the visitor's email app.
      var lines = [];
      data.forEach(function (value, key) { if (String(value).trim()) lines.push(key + ": " + value); });
      window.location.href = "mailto:" + form.getAttribute("data-to") +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));
      say("Your email app should open with your answers filled in. Press send there to finish.");
    });
  });
})();
