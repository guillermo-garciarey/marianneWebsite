/*
	Dimension by Pixelarity
	pixelarity.com | hello@pixelarity.com
	License: pixelarity.com/license
*/

// Prevent scrolling on page load
// window.addEventListener("load", function () {
// 	document.body.style.overflow = "hidden";
// });

document.querySelector(".chevronbutton").addEventListener("click", function () {
	const menu = document.querySelector("#menuscreen");
	const content = document.querySelector(".content");

	// Hide the content div
	content.style.display = "none";

	// Prevent scrolling
	document.body.style.overflow = "hidden";

	// Show the menu with fade-in effect
	menu.classList.add("active");
});

function updateVH() {
	document.documentElement.style.setProperty(
		"--vh",
		`${window.innerHeight * 0.01}px`
	);
}

// Set on load
updateVH();

// window.onload = function () {
// 	const bgElement = document.getElementById("bg");

// 	// Add the 'loaded' class to the element on page load
// 	bgElement.classList.add("loaded");

// 	// Listen for any interaction (e.g., mouse click, key press, etc.)
// 	document.body.addEventListener("click", function () {
// 		bgElement.classList.remove("loaded"); // Remove the rotation after interaction

// 		// Add a delay before changing the transform property
// 		setTimeout(function () {
// 			bgElement.style.setProperty("--bg-transform", "scale(1.125)");
// 		}, 1000); // 1000 milliseconds = 1 second
// 	});

// 	// Optional: Listen for other events like keypress, scroll, etc.
// 	document.body.addEventListener("keypress", function () {
// 		bgElement.classList.remove("loaded");

// 		// Add a delay before changing the transform property
// 		setTimeout(function () {
// 			bgElement.style.setProperty("--bg-transform", "scale(1.125)");
// 		}, 1000); // 1000 milliseconds = 1 second
// 	});
// };

// Update when window resizes (e.g., address bar hides)
window.addEventListener("resize", updateVH);

document.addEventListener("DOMContentLoaded", function () {
	const menuItems = document.querySelectorAll(".menu_item");
	let index = 0;

	function applyEffect() {
		// Reset all items first
		menuItems.forEach((item) => {
			item.style.filter = "";
			item.style.transform = "";
		});

		// Apply styles to the current item
		menuItems[index].style.filter = "none";

		// Move to the next item
		index = (index + 1) % menuItems.length;

		// Repeat the effect every 1.5 seconds
		setTimeout(applyEffect, 4500);
	}

	// Start the cycling effect
	applyEffect();
});

// document.querySelectorAll(".menu_item").forEach((item) => {
// 	item.addEventListener("click", function () {
// 		const link = this.querySelector("a");
// 		if (link) {
// 			window.location.href = link.href;
// 		}
// 	});
// });

(function ($) {
	var $window = $(window),
		$body = $("body"),
		$wrapper = $("#wrapper"),
		$header = $("#header"),
		$footer = $("#footer"),
		$main = $("#main"),
		$main_articles = $main.children("article");

	// Breakpoints.
	breakpoints({
		xlarge: ["1281px", "1680px"],
		large: ["981px", "1280px"],
		medium: ["737px", "980px"],
		small: ["481px", "736px"],
		xsmall: ["361px", "480px"],
		xxsmall: [null, "360px"],
	});

	// Play initial animations on page load.
	$window.on("load", function () {
		window.setTimeout(function () {
			$body.removeClass("is-preload");
		}, 100);
	});

	// Fix: Flexbox min-height bug on IE.
	if (browser.name == "ie") {
		var flexboxFixTimeoutId;

		$window
			.on("resize.flexbox-fix", function () {
				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function () {
					if ($wrapper.prop("scrollHeight") > $window.height())
						$wrapper.css("height", "auto");
					else $wrapper.css("height", "100vh");
				}, 250);
			})
			.triggerHandler("resize.flexbox-fix");
	}

	// Nav.
	var $nav = $header.children("nav"),
		$nav_li = $nav.find("li");

	// Add "middle" alignment classes if we're dealing with an even number of items.
	if ($nav_li.length % 2 == 0) {
		$nav.addClass("use-middle");
		$nav_li.eq($nav_li.length / 2).addClass("is-middle");
	}

	// Main.
	var delay = 325,
		locked = false;

	// Methods.
	$main._show = function (id, initial) {
		var $article = $main_articles.filter("#" + id);

		// No such article? Bail.
		if ($article.length == 0) return;

		// Handle lock.

		// Already locked? Speed through "show" steps w/o delays.
		if (locked || (typeof initial != "undefined" && initial === true)) {
			// Mark as switching.
			$body.addClass("is-switching");

			// Mark as visible.
			$body.addClass("is-article-visible");

			// Deactivate all articles (just in case one's already active).
			$main_articles.removeClass("active");

			// Hide header, footer.
			$header.hide();
			$footer.hide();

			// Show main, article.
			$main.show();
			$article.show();

			// Activate article.
			$article.addClass("active");

			// Unlock.
			locked = false;

			// Unmark as switching.
			setTimeout(
				function () {
					$body.removeClass("is-switching");
				},
				initial ? 1000 : 0
			);

			return;
		}

		// Lock.
		locked = true;

		// Article already visible? Just swap articles.
		if ($body.hasClass("is-article-visible")) {
			// Deactivate current article.
			var $currentArticle = $main_articles.filter(".active");

			$currentArticle.removeClass("active");

			// Show article.
			setTimeout(function () {
				// Hide current article.
				$currentArticle.hide();

				// Show article.
				$article.show();

				// Activate article.
				setTimeout(function () {
					$article.addClass("active");

					// Window stuff.
					$window.scrollTop(0).triggerHandler("resize.flexbox-fix");

					// Unlock.
					setTimeout(function () {
						locked = false;
					}, delay);
				}, 25);
			}, delay);
		}

		// Otherwise, handle as normal.
		else {
			// Mark as visible.
			$body.addClass("is-article-visible");

			// Show article.
			setTimeout(function () {
				// Hide header, footer.
				$header.hide();
				$footer.hide();

				// Show main, article.
				$main.show();
				$article.show();

				// Activate article.
				setTimeout(function () {
					$article.addClass("active");

					// Window stuff.
					$window.scrollTop(0).triggerHandler("resize.flexbox-fix");

					// Unlock.
					setTimeout(function () {
						locked = false;
					}, delay);
				}, 25);
			}, delay);
		}
	};

	$main._hide = function (addState) {
		var $article = $main_articles.filter(".active");

		// Article not visible? Bail.
		if (!$body.hasClass("is-article-visible")) return;

		// Add state?
		if (typeof addState != "undefined" && addState === true)
			history.pushState(null, null, "#");

		// Handle lock.

		// Already locked? Speed through "hide" steps w/o delays.
		if (locked) {
			// Mark as switching.
			$body.addClass("is-switching");

			// Deactivate article.
			$article.removeClass("active");

			// Hide article, main.
			$article.hide();
			$main.hide();

			// Show footer, header.
			$footer.show();
			$header.show();

			// Unmark as visible.
			$body.removeClass("is-article-visible");

			// Unlock.
			locked = false;

			// Unmark as switching.
			$body.removeClass("is-switching");

			// Window stuff.
			$window.scrollTop(0).triggerHandler("resize.flexbox-fix");

			return;
		}

		// Lock.
		locked = true;

		// Deactivate article.
		$article.removeClass("active");

		// Hide article.
		setTimeout(function () {
			// Hide article, main.
			$article.hide();
			$main.hide();

			// Show footer, header.
			$footer.show();
			$header.show();

			// Unmark as visible.
			setTimeout(function () {
				$body.removeClass("is-article-visible");

				// Window stuff.
				$window.scrollTop(0).triggerHandler("resize.flexbox-fix");

				// Unlock.
				setTimeout(function () {
					locked = false;
				}, delay);
			}, 25);
		}, delay);
	};

	// Articles.
	$main_articles.each(function () {
		var $this = $(this);

		// Close.
		$('<div class="close">Close</div>')
			.appendTo($this)
			.on("click", function () {
				location.hash = "";
			});

		// Prevent clicks from inside article from bubbling.
		$this.on("click", function (event) {
			event.stopPropagation();
		});
	});

	// Events.
	$body.on("click", function (event) {
		// Article visible? Hide.
		if ($body.hasClass("is-article-visible")) $main._hide(true);
	});

	$window.on("keyup", function (event) {
		switch (event.keyCode) {
			case 27:
				// Article visible? Hide.
				if ($body.hasClass("is-article-visible")) $main._hide(true);

				break;

			default:
				break;
		}
	});

	$window.on("hashchange", function (event) {
		// Empty hash?
		if (location.hash == "" || location.hash == "#") {
			// Prevent default.
			event.preventDefault();
			event.stopPropagation();

			// Hide.
			$main._hide();
		}

		// Otherwise, check for a matching article.
		else if ($main_articles.filter(location.hash).length > 0) {
			// Prevent default.
			event.preventDefault();
			event.stopPropagation();

			// Show article.
			$main._show(location.hash.substr(1));
		}
	});

	// Scroll restoration.
	// This prevents the page from scrolling back to the top on a hashchange.
	if ("scrollRestoration" in history) history.scrollRestoration = "manual";
	else {
		var oldScrollPos = 0,
			scrollPos = 0,
			$htmlbody = $("html,body");

		$window
			.on("scroll", function () {
				oldScrollPos = scrollPos;
				scrollPos = $htmlbody.scrollTop();
			})
			.on("hashchange", function () {
				$window.scrollTop(oldScrollPos);
			});
	}

	// Initialize.

	// Hide main, articles.
	$main.hide();
	$main_articles.hide();

	// Initial article.
	if (location.hash != "" && location.hash != "#")
		$window.on("load", function () {
			$main._show(location.hash.substr(1), true);
		});

	// My stuff
	document.querySelectorAll(".menu_item a").forEach((link) => {
		link.addEventListener("click", function (event) {
			const targetSection = this.getAttribute("href").substring(1); // Get section ID
			const bgDiv = document.getElementById("bg");

			// Background images for each section
			const backgrounds = {
				about: "url('../../images/aboutme.jpg')",
				services: "url('../../images/services.jpg')",
				consultation: "url('../../images/consultation.jpg')",
				contact: "url('../../images/contact.jpg')",
			};

			// Update the background if the section exists in our object
			if (backgrounds[targetSection]) {
				bgDiv.style.setProperty("--bg-image", backgrounds[targetSection]);
				bgDiv.style.backgroundSize = "cover"; // Ensure it stays cover
				bgDiv.style.backgroundPosition = "top"; // Keep the image positioned at the top
			}

			// Allow scripts to run AFTER background updates
			setTimeout(() => {
				document
					.getElementById(targetSection)
					.scrollIntoView({ behavior: "smooth" });

				console.log("Background updated, scrolling finished...");
			}, 50); // Small delay ensures smooth execution
		});
	});
})(jQuery);
