const projects = [
  {
    title: "Project One",
    image: "https://images.unsplash.com/photo-1581093588401-1d8e9f10d8ea?auto=format&fit=crop&w=800&q=80",
    description: "Description for project one."
  },
  {
    title: "Project Two",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    description: "Description for project two."
  },
  {
    title: "Project Three",
    image: "https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=800&q=80",
    description: "Description for project three."
  },
  {
    title: "Project Four",
    image: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=800&q=80",
    description: "Description for project four."
  },
  {
    title: "Project Five",
    image: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=800&q=80",
    description: "Description for project five."
  },
  {
    title: "Project Six",
    image: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=800&q=80",
    description: "Description for project six."
  }

];

const outerRadius = 48;
const innerRadius = 36;
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

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", createSlicePath(outerRadius, innerRadius, startAngle, endAngle));
  path.setAttribute("role", "listitem");
  path.setAttribute("tabindex", "0");
  path.setAttribute("aria-label", project.title);

  svg.appendChild(path);
});
