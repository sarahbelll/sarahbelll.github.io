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

const centerCopy = document.querySelector('.centre-copy');

function updateCenterCopy(project = null) {
  if (!project) {
    centerCopy.innerHTML = `
      <h1>
        <span class='first-name'>Sarah</span>
        <span class='last-name'>BELL</span>
      </h1>
      <p>Software Developer</p>
    `;
  } else {
    centerCopy.innerHTML = `
    <h1>${project.title}</h1>
    <p>${project.client}</p>
    `
  }
}

let currentRotation = 0;

const outerRadius = 60;
const innerRadius = 48;
const gapDegrees = 2;

function polarToXY(radius, degrees) {
  const radians = (degrees - 90) * Math.PI / 180;
  return {
    x: radius * Math.cos(radians),
    y: radius * Math.sin(radians)
  };
}

function createSlicePath(rOuter, rInner, startAngle, endAngle) {
  const startOuter = polarToXY(rOuter, startAngle);
  const endOuter = polarToXY(rOuter, endAngle);
  const startInner = polarToXY(rInner, startAngle);
  const endInner = polarToXY(rInner, endAngle);

  const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;

  return `
    M ${startOuter.x} ${startOuter.y}
    A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}
    L ${endInner.x} ${endInner.y}
    A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}
    Z
  `;
}

const svg = document.getElementById("ring");
const sliceCount = projects.length;
const totalGap = gapDegrees * sliceCount;
const totalDegrees = 360 - totalGap;
const sliceDegrees = totalDegrees / sliceCount;

projects.forEach((project, i) => {
  const startAngle = i * (sliceDegrees + gapDegrees);
  const endAngle = startAngle + sliceDegrees;
  const clipPathId = `clip-${i}`;

  const normalPath = createSlicePath(outerRadius, innerRadius, startAngle, endAngle);
  const expandedPath = createSlicePath(outerRadius + 6, innerRadius, startAngle, endAngle);

  const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
  clipPath.setAttribute("id", clipPathId);

  const clipShape = document.createElementNS("http://www.w3.org/2000/svg", "path");
  clipShape.setAttribute("d", normalPath);
  clipPath.appendChild(clipShape);

  let defs = svg.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    svg.appendChild(defs);
  }
  defs.appendChild(clipPath);

  const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
  image.setAttribute("href", project.image);
  image.setAttribute("x", -outerRadius - 6);
  image.setAttribute("y", -outerRadius - 6);
  image.setAttribute("width", (outerRadius + 6) * 2);
  image.setAttribute("height", (outerRadius + 6) * 2);
  image.setAttribute("clip-path", `url(#${clipPathId})`);
  image.setAttribute("preserveAspectRatio", "xMidYMid slice")

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.classList.add("project-slice");
  group.appendChild(image);
  svg.appendChild(group);

  group.addEventListener("mouseenter", () => {
    clipShape.setAttribute("d", expandedPath);
    updateCenterCopy(project);
  })

  group.addEventListener("mouseleave", () => {
    clipShape.setAttribute("d", normalPath);
    updateCenterCopy();
  });

  group.addEventListener("click", () => {
    const sliceAngle = sliceDegrees + gapDegrees;
    const sliceCenterAngle = (i * sliceAngle) + (sliceAngle / 2);

    currentRotation = 90 + sliceCenterAngle;

    let rotationDiff = targetRotation - currentRotation;

    rotationDiff = ((rotationDiff + 180) % 360) - 180;

    currentRotation += rotationDiff;

    svg.style.transform = `rotate(${currentRotation}deg)`;

    showModal(project);
  })
});