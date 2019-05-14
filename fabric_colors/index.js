
const picCanvas = document.getElementById('pic');
const graphCanvas = document.getElementById('graph');

const picCtx = picCanvas.getContext('2d');
const graphCtx = graphCanvas.getContext('2d');

const { width, height } = graphCanvas;
const xScale = width;
const yScale = height;
graphCtx.scale(xScale, yScale);

let pix = [];
let xys = [];
let xy_rgb_lookup = {};
const CIRCLE_RADIUS = 0.005;
const swatchHolder = document.getElementById('swatches');

const defaultPix = 4;
const defaultClusters = 10;

const wait = ms => new Promise(res => setTimeout(res, ms));
function fileChosen(fileList) {
	const [ file ] = fileList;
	// console.log( 'file:', file );

	const reader = new FileReader();
	reader.onload = e => {
		const imageData = e.target.result;
		// console.log( 'imageData:', imageData );
		const img = document.createElement('IMG');
		img.src = imageData;

		img.onload = async () => {
			document.getElementById('pixelCount').value = defaultPix;
			document.getElementById('numClusters').value = defaultClusters;

			picCtx.drawImage(img, 0, 0, picCanvas.width, picCanvas.height);
			extractAndGraphPixels();
			await wait(10);
			calculateAndGraphClusters();
		}
	}

	reader.readAsDataURL(file);
}


const getInputVal = (id, isFloat = false) => {
	const parseFn = isFloat ? parseFloat : parseInt;
	return parseFn(document.getElementById(id).value)
};

function extractAndGraphPixels() {

	
	swatchHolder.innerHTML = '';

	const { data: pixels } = picCtx.getImageData(0, 0, picCanvas.width, picCanvas.height);
	pix = [];
	const pixMap = {};
	for (let i = 0, n = pixels.length; i < n; i += 4) {
		const r = pixels[i];
		const g = pixels[i + 1];
		const b = pixels[i + 2];

		const rgb = [r, g, b].join(',');
		if (!pixMap[rgb]) {
			pixMap[rgb] = 1;
		} else {
			pixMap[rgb]++;
		}
	}

	const MIN_COUNT = getInputVal('pixelCount');
	Object.entries(pixMap).forEach(([key, val]) => {

		if (val >= MIN_COUNT) {
			const [r, g, b] = key.split(',');
			pix.push({r, g, b});
		}
	});

	// clear canvas
	graphCtx.fillStyle = 'white';
	graphCtx.fillRect(0, 0, 1, 1);

	// get x,y data and draw to canvas
	xys = [];

	xy_rgb_lookup = {};

	// console.log( 'pix:', pix );
	pix.forEach(({r, g, b}) => {
		const [x, y] = rgb_to_cie(r, g, b).map(x => parseFloat(x));
		xy_rgb_lookup[[x, y].join('_')] = [r, g, b];
		xys.push([x, y]);
		// console.log( 'x,y:', x,y );
		graphCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
		graphCtx.beginPath();
		graphCtx.arc(x, y, CIRCLE_RADIUS, 0, 2 * Math.PI, false);
		graphCtx.fill();
	});
}

function calculateAndGraphClusters() {
	extractAndGraphPixels();
	

	const NUM_CLUSTERS = getInputVal('numClusters');
	clusterMaker.k(NUM_CLUSTERS);

	clusterMaker.iterations(getInputVal('iterationCount'));
	clusterMaker.data(xys);
	const clusters = clusterMaker.clusters();
	
	const centroidRadius = CIRCLE_RADIUS * 4;

	// Group cluster centers by overlapping and only allow one cluster in each overlapping group

	const getDist = (c1, c2) => {
		const [x1, y1] = c1.centroid;
		const [x2, y2] = c2.centroid;
		const dSquared = (x1 - x2) ** 2 + (y1 - y2) ** 2;
		return Math.sqrt(dSquared);
	}

	// TODO could specify target number of groups, increase intersectionDistance until target is reached
	const intersectionDist = centroidRadius * getInputVal('clusterOverlap', true);
	clusters.forEach((c, i) => {
		c.siblings = new Set();
		c.index = i;
	});
	// connect all overlapping clusters (siblings)
	clusters.forEach((c1, i) => {
		clusters.forEach((c2, j) => {
			if (i < j) { // handle each pairing once
				if (getDist(c1, c2) <= intersectionDist) {
					c1.siblings.add(j);
					c2.siblings.add(i);
				}
			}
		});
	});

	// Get groups with immediate siblings
	let siblingGroups = clusters.map(c => {
		const group = new Set(c.siblings);
		group.add(c.index);
		return group;
	});

	function hasIntersection(s1, s2) {
		return [...s1].some(x => s2.has(x));
	}

	let independentClusters = [];
	while (siblingGroups.length) {
		combineGroups();
	}

	function combineGroups() {
		const [g1, ...others] = siblingGroups;
		let isAdded = false;
		for (const group of others) {
			if (hasIntersection(group, g1)) {
				isAdded = true;
				[...g1].forEach(g => group.add(g));
			}
		}
		if (!isAdded) {
			independentClusters.push(g1);
		}
		siblingGroups = [...others];
	}

	// translate cluster indices into actual clusters
	independentClusters = independentClusters.map(clusterSet => {
		return [...clusterSet].map(i => clusters[i]);
	});

	// take average cluster from each group
	filteredClusters = independentClusters.map(clusters => {
		if (clusters.length === 1) {
			return clusters[0];
		}

		let xSum = 0, ySum = 0;
		const x = clusters.map(c => c.centroid[0]);
		const y = clusters.map(c => c.centroid[1]);
		x.forEach(x => xSum += x);
		y.forEach(y => ySum += y);

		const xAvg = xSum / clusters.length;
		const yAvg = ySum / clusters.length;

		const points = [];
		clusters.forEach(c => points.push(...c.points));

		// console.log( 'x:', x );
		// console.log( 'y:', y );
		return { centroid: [xAvg, yAvg], points };
	});

	// console.log( 'filteredClusters:', filteredClusters );

	filteredClusters.forEach(c => {
		const { centroid } = c;
		const [x, y] = centroid;
		graphCtx.beginPath();
		graphCtx.lineWidth = centroidRadius / 7;
		graphCtx.arc(x, y, centroidRadius, 0, 2 * Math.PI, false);
		graphCtx.stroke();
	});
	
	const clusterCenters = filteredClusters.map(c => {
		const { centroid, points } = c;
		const [x, y] = centroid;
		let newCenter;
		let distance = Infinity;
		points.forEach(([x1, y1]) => {
			const dist = (x - x1) ** 2 + (y - y1) ** 2;
			if (dist < distance) {
				distance = dist;
				newCenter = [x1, y1];
			}
		})

		return newCenter;
	});

	// TODO sort swatches so colors always in same order
	const swatches = clusterCenters.map(([x, y]) => {
		// get closest point, then perform reverse lookup
		const [r, g, b] = xy_rgb_lookup[[x, y].join('_')];
		const div = document.createElement('DIV');
		div.classList = 'swatch';
		div.style = `background: rgb(${[r, g, b].join(',')})`;
		return div; 
	});


	
	swatches.forEach(s => swatchHolder.appendChild(s));
}
