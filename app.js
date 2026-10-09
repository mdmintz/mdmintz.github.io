const cursor = document.querySelector(".cursor");
const cursorRing = document.querySelector(".cursor-ring");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let ringX = mouseX;
let ringY = mouseY;

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  if (cursor) {
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  }
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;

  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }

  requestAnimationFrame(animateCursor);
}

animateCursor();


// ----------------------------------------------------
// HERO PARALLAX
// ----------------------------------------------------

const hero = document.querySelector(".hero");
const heroContent = document.querySelector(".hero-content");
const heroGrid = document.querySelector(".hero-grid");

window.addEventListener("scroll", () => {

  if (!hero) return;

  const scroll = window.scrollY;
  const height = window.innerHeight;

  if (scroll > height) return;

  const progress = Math.min(scroll / height, 1);

  if (heroContent) {
    heroContent.style.transform = `
      translateY(${progress * -60}px)
      scale(${1 - progress * .04})
    `;

    heroContent.style.opacity = `${1 - progress}`;
  }

  const heroStatus = document.querySelector(".hero-status");

  if (heroStatus) {
    heroStatus.style.transform = `
      translateY(${progress * 35}px)
    `;

    heroStatus.style.opacity = `${Math.max(0, 1 - progress * 2)}`;
  }

  if (heroGrid) {
    heroGrid.style.transform = `
      perspective(800px)
      rotateX(65deg)
      scale(${2 + progress})
      translateY(${30 + progress * 15}%)
    `;
  }
});


// ----------------------------------------------------
// AUTOMATION UNIVERSE
// ----------------------------------------------------

const universe = document.querySelector("#universe");
const world = document.querySelector("#world");

let dragging = false;

let startX = 0;
let startY = 0;

let worldX = 0;
let worldY = 0;

let targetX = 0;
let targetY = 0;

if (universe && world) {

  universe.addEventListener("pointerdown", (event) => {

    if (event.target.closest(".node")) {
      return;
    }

    dragging = true;

    universe.setPointerCapture(event.pointerId);

    startX = event.clientX;
    startY = event.clientY;
  });


  universe.addEventListener("pointermove", (event) => {

    if (!dragging) return;

    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    targetX += dx;
    targetY += dy;

    startX = event.clientX;
    startY = event.clientY;
  });


  universe.addEventListener("pointerup", () => {
    dragging = false;
  });


  universe.addEventListener("pointercancel", () => {
    dragging = false;
  });


  function animateUniverse() {

    worldX += (targetX - worldX) * .08;
    worldY += (targetY - worldY) * .08;

    world.style.transform = `
      translate3d(${worldX}px, ${worldY}px, 0)
      rotateX(${worldY * -.01}deg)
      rotateY(${worldX * .01}deg)
    `;

    updateConnections();

    requestAnimationFrame(animateUniverse);
  }

  animateUniverse();
}


// ----------------------------------------------------
// SVG CONNECTIONS
// ----------------------------------------------------

function updateConnections() {

  const universeElement =
    document.querySelector(".universe");

  if (!universeElement) return;

  const rect =
    universeElement.getBoundingClientRect();

  const nodes = [
    document.querySelector('[data-category="testing"]'),
    document.querySelector('[data-category="scraping"]'),
    document.querySelector('[data-category="interaction"]'),
    document.querySelector('[data-category="cdp"]')
  ];

  const center =
    document.querySelector('[data-category="browser"]');

  if (!center) return;

  const centerRect =
    center.getBoundingClientRect();

  const cx =
    centerRect.left +
    centerRect.width / 2 -
    rect.left;

  const cy =
    centerRect.top +
    centerRect.height / 2 -
    rect.top;

  nodes.forEach((node, index) => {

    if (!node) return;

    const nodeRect =
      node.getBoundingClientRect();

    const x =
      nodeRect.left +
      nodeRect.width / 2 -
      rect.left;

    const y =
      nodeRect.top +
      nodeRect.height / 2 -
      rect.top;

    const line =
      document.querySelector(`#line-${index + 1}`);

    if (!line) return;

    line.setAttribute("x1", cx);
    line.setAttribute("y1", cy);

    line.setAttribute("x2", x);
    line.setAttribute("y2", y);
  });
}


// ----------------------------------------------------
// MISSION DATA
// ----------------------------------------------------

const examples = {

  login: {
    category: "MISSION 001 / BEGINNER",
    title: "Automated Login Test",

    description:
      "A simple browser automation flow: navigate to a page, enter credentials, submit a form and verify the result.",

    code:
`from seleniumbase import sb_cdp

sb = sb_cdp.Chrome()
sb.goto("seleniumbase.io/simple/login")
sb.type("#username", "demo_user")
sb.type("#password", "secret_pass")
sb.click('a:contains("Sign in")')
sb.assert_text("Welcome!")`,

    source:
      "https://github.com/seleniumbase/SeleniumBase"
  },

  scraping: {
    category: "MISSION 002 / INTERMEDIATE",
    title: "Web Scraping",

    description:
      "Use SeleniumBase to navigate a page and extract useful information from rendered browser content.",

    code:
`from seleniumbase import sb_cdp

sb = sb_cdp.Chrome()
sb.goto("https://example.com")
print(sb.get_title())
print(sb.get_text("body"))`,

    source:
      "https://github.com/seleniumbase/SeleniumBase"
  },

  interaction: {
    category: "MISSION 003 / INTERMEDIATE",
    title: "Browser Interaction",

    description:
      "Automate the kinds of interactions that make browser testing interesting: typing, clicking and manipulating UI elements.",

    code:
`from seleniumbase import sb_cdp

sb = sb_cdp.Chrome()
sb.goto("seleniumbase.io/demo_page")
sb.type("#myTextInput", "This is Automated")
sb.click('button:contains("Click Me")')
sb.click("#checkBox1")
sb.drag_and_drop("img#logo", "div#drop2")
sb.assert_element("div#drop2 img#logo")`,

    source:
      "https://github.com/seleniumbase/SeleniumBase"
  },

  cdp: {
    category: "MISSION 004 / INTERMEDIATE",
    title: "Bypassing a CAPTCHA",

    description:
      "Explore SeleniumBase CDP Mode for bypassing CAPTCHAs.",

    code:
`from seleniumbase import sb_cdp

sb = sb_cdp.Chrome()
sb.goto("https://www.planetminecraft.com/account")
sb.type('input[name="email"]', "test@example.com")
sb.type('input[name="password"]', "Fake_Password")
sb.click("input#autologin")  # The checkbox
if sb.is_element_visible("input[disabled]"):
    sb.solve_captcha()  # Enables the input button
sb.assert_element_absent("input[disabled]")
sb.sleep(1.5)`,

    source:
      "https://github.com/seleniumbase/SeleniumBase"
  }

};


// ----------------------------------------------------
// MISSION MODAL
// ----------------------------------------------------

const modal =
  document.querySelector("#mission-modal");

const modalClose =
  document.querySelector("#modal-close");

const modalTitle =
  document.querySelector("#modal-title");

const modalCategory =
  document.querySelector("#modal-category");

const modalDescription =
  document.querySelector("#modal-description");

const modalCode =
  document.querySelector("#modal-code");

const modalSource =
  document.querySelector("#modal-source");


function openMission(name) {

  const example = examples[name];

  if (!example) return;

  //modalCategory.textContent =
  //  example.category;

  modalTitle.textContent =
    example.title;

  modalDescription.textContent =
    example.description;

  modalCode.textContent =
    example.code;

  modalSource.href =
    example.source;

  modal.classList.add("open");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );
}


document.querySelectorAll(".node").forEach((node) => {
  node.addEventListener("click", () => {
    const category = node.dataset.category;

    const missionMap = {
      testing: "login",
      scraping: "scraping",
      interaction: "interaction",
      cdp: "cdp"
    };

    if (category === "browser") {
      document.querySelector("#missions")?.scrollIntoView({
        behavior: "smooth"
      });
      return;
    }

    const mission = missionMap[category];

    if (mission) {
      openMission(mission);
    }
  });
});


function closeMission() {

  modal.classList.remove("open");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );
}


document
  .querySelectorAll(".mission-card")
  .forEach((card) => {

  const openButton = card.querySelector(".mission-open");

  // Skip cards without an open button.
  if (!openButton) {
    return;
}

openButton.addEventListener("click", () => {
  openMission(card.dataset.example);
});

});

if (modalClose) {
  modalClose.addEventListener("click", closeMission);
}


modal.addEventListener(
  "click",
  (event) => {

    if (event.target === modal) {
      closeMission();
    }

  }
);


document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {
      closeMission();
    }

  }
);


// ----------------------------------------------------
// LIVE AUTOMATION REPLAY
// ----------------------------------------------------

const runButton =
  document.querySelector("#run-demo");

const username =
  document.querySelector("#demo-username");

const password =
  document.querySelector("#demo-password");

const loginButton =
  document.querySelector("#demo-login-button");

const success =
  document.querySelector("#demo-success");

const status =
  document.querySelector("#execution-status");

const codeLines =
  document.querySelectorAll(".code-line");

const browserPage =
  document.querySelector(".browser-page");

const addressBar =
  document.querySelector(".address");

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}


async function runAutomation() {

  runButton.disabled = true;

  username.value = "";
  password.value = "";

  success.classList.remove("visible");
  browserPage.classList.remove("is-loading");
  addressBar.textContent = "about:blank";

  status.textContent = "RUNNING";


  codeLines.forEach(line => {
    line.classList.remove("active");
  });


  // Step 1: Open the browser — fade out the current page
  activateLine(1);
  browserPage.classList.add("is-loading");
  status.textContent = "OPENING BROWSER";
  await sleep(450);


  // Step 2: Navigate — update the address and reveal the page
  activateLine(2);
  status.textContent = "NAVIGATING";
  addressBar.textContent = "seleniumbase.io/simple/login";
  await sleep(250);
  browserPage.classList.remove("is-loading");
  await sleep(450);


  // Step 3
  activateLine(3);
  status.textContent = "TYPING";

  await typeText(
    username,
    "demo_user"
  );

  await sleep(300);


  // Step 4
  activateLine(4);

  await typeText(
    password,
    "secret_pass"
  );

  await sleep(400);


  // Step 5
  activateLine(5);
  status.textContent = "CLICKING";

  loginButton.style.transform =
    "scale(.96)";

  await sleep(150);

  loginButton.style.transform =
    "scale(1)";

  await sleep(500);


  // Step 6
  activateLine(6);

  await sleep(500);

  success.classList.add("visible");

  status.textContent = "✓ PASS";

  runButton.disabled = false;
}


function activateLine(index) {

  codeLines.forEach(
    line => line.classList.remove("active")
  );

  if (codeLines[index]) {
    codeLines[index].classList.add("active");
  }
}


async function typeText(input, text) {

  input.value = "";

  for (const character of text) {

    input.value += character;

    await sleep(50);
  }
}


runButton.addEventListener(
  "click",
  runAutomation
);


// ----------------------------------------------------
// NODE HOVER EFFECT
// ----------------------------------------------------

document
  .querySelectorAll(".node")
  .forEach(node => {

    node.addEventListener(
      "mouseenter",
      () => {

        document
          .querySelectorAll(".node")
          .forEach(other => {

            if (other !== node) {
              other.style.opacity = ".35";
            }

          });

      }
    );


    node.addEventListener(
      "mouseleave",
      () => {

        document
          .querySelectorAll(".node")
          .forEach(other => {

            other.style.opacity = "1";

          });

      }
    );

  });


// ----------------------------------------------------
// INTERSECTION REVEALS
// ----------------------------------------------------

const revealElements =
  document.querySelectorAll(
    ".intro-content, .terminal, .mission-card, .demo-header, .demo-layout, .about-content"
  );


const observer =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.style.opacity = "1";
          entry.target.style.transform =
            "translateY(0)";

          observer.unobserve(
            entry.target
          );

        }

      });

    },
    {
      threshold: .15
    }
  );


revealElements.forEach(element => {

  element.style.opacity = "0";

  element.style.transform =
    "translateY(40px)";

  element.style.transition =
    "opacity 1s cubic-bezier(.16,1,.3,1), " +
    "transform 1s cubic-bezier(.16,1,.3,1)";

  observer.observe(element);

});
