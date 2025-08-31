const projects = [
  {
    title: "Football Event Centres",
    client: "Sky Sports Mobile App - UK, DE, IT",
    image: "assets/placeholder.jpg",
    description: "Description for project one."
  },
  {
    title: "Sports Recap and Key Plays",
    client: "Sky Sports TV App & Peacock",
    image: "assets/placeholder.jpg",
    description: "Description for project two."
  },
  {
    title: "Motion Gaming - Beyond TV Experiences",
    client: "Sky Live for Sky Glass",
    image: "assets/placeholder.jpg",
    description: "Description for project three."
  },
  {
    title: "Virtual Production",
    client: "Sky Studios",
    image: "assets/placeholder.jpg",
    description: "Description for project four."
  },
  {
    title: "Social Entrepreneurship",
    client: "The University of Sheffield",
    image: "assets/placeholder.jpg",
    description: "Description for project five."
  },
  {
    title: "Just For Fun",
    image: "assets/placeholder.jpg",
    description: "Description for project six."
  }
];

const svg = document.getElementById("ring");
const centerCopy = document.querySelector(".centre-copy");
const detailsSection = document.getElementById("project-details");
const detailsTitle = document.getElementById("details-title");
const detailsImg = document.getElementById("details-img");
const detailsClient = document.getElementById("details-client");
const detailsText = document.getElementById("details-text");
const detailsLink = document.getElementById("details-link");

const outerRadius = 60;
const innerRadius = 48;
const gapDegrees = 2;
const sliceCount = projects.length;
const sliceAngle = (360 - gapDegrees * sliceCount) / sliceCount;
let currentRotation = 0;

const polarToXY = (radius, degrees) => {
  const radians = (degrees - 90) * Math.PI / 180;
  return { x: radius * Math.cos(radians), y: radius * Math.sin(radians) };
};

const createSlicePath = (rOuter, rInner, startDeg, endDeg) => {
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  const p1 = polarToXY(rOuter, startDeg);
  const p2 = polarToXY(rOuter, endDeg);
  const p3 = polarToXY(rInner, endDeg);
  const p4 = polarToXY(rInner, startDeg);

  return `
    M ${p1.x} ${p1.y}
    A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y}
    L ${p3.x} ${p3.y}
    A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x} ${p4.y}
    Z
  `;
};

const updateCenterCopy = (project) => {
  centerCopy.innerHTML = project ? `
    <h1>${project.title}</h1>
    <p>${project.client || ''}</p>
  ` : `
    <h1><span class='first-name'>Sarah</span><span class='last-name'>BELL</span></h1>
    <p>Software Developer</p>
  `;
};

const showProjectDetails = (project) => {
  detailsTitle.textContent = project.title;
  detailsImg.src = project.image;
  detailsImg.alt = project.title;
  detailsClient.textContent = project.client || '';
  detailsText.textContent = project.description;
  detailsLink.href = project.link || '#';
  detailsLink.style.display = project.link ? 'inline-block' : 'none';

  detailsSection.hidden = false;

  setTimeout(() => {
    detailsSection.scrollIntoView({ behavior: "smooth" });
  }, 100);
};

projects.forEach((project, i) => {
  const startAngle = i * (sliceAngle + gapDegrees);
  const endAngle = startAngle + sliceAngle;
  const slicePath = createSlicePath(outerRadius, innerRadius, startAngle, endAngle);
  const expandedPath = createSlicePath(outerRadius + 6, innerRadius, startAngle, endAngle);

  const clipPathId = `clip-${i}`;
  let defs = svg.querySelector("defs") || svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "defs"));
  const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
  clipPath.id = clipPathId;

  const clipShape = document.createElementNS("http://www.w3.org/2000/svg", "path");
  clipShape.setAttribute("d", slicePath);
  clipPath.appendChild(clipShape);
  defs.appendChild(clipPath);

  const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
  image.setAttribute("href", project.image);
  image.setAttribute("x", -outerRadius - 6);
  image.setAttribute("y", -outerRadius - 6);
  image.setAttribute("width", (outerRadius + 6) * 2);
  image.setAttribute("height", (outerRadius + 6) * 2);
  image.setAttribute("clip-path", `url(#${clipPathId})`);
  image.setAttribute("preserveAspectRatio", "xMidYMid slice");

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.classList.add("project-slice");
  group.appendChild(image);
  svg.appendChild(group);

  group.addEventListener("mouseenter", () => {
    clipShape.setAttribute("d", expandedPath);
    updateCenterCopy(project);
  });
  group.addEventListener("mouseleave", () => {
    clipShape.setAttribute("d", slicePath);
    updateCenterCopy(null);
  });

  group.addEventListener("click", () => {
    const centerAngle = (i * (sliceAngle + gapDegrees)) + (sliceAngle / 2);
    const targetRotation = 180 - centerAngle;
    let rotationDiff = ((targetRotation - currentRotation + 180) % 360) - 180;
    currentRotation += rotationDiff;

    svg.style.transform = `rotate(${currentRotation}deg)`;

    svg.addEventListener("transitionend", function handler() {
      svg.removeEventListener("transitionend", handler);
      showProjectDetails(project);
    }, { once: true });
  });
});
