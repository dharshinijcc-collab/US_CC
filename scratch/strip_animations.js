const fs = require('fs');

const file = 'src/StudioPage.js';
let content = fs.readFileSync(file, 'utf8');

// Strip imports
content = content.replace(/import useMagneticHover from '.\/hooks\/useMagneticHover';\n/g, '');
content = content.replace(/import SpotlightCursor from '.\/components\/effects\/SpotlightCursor';\n/g, '');
content = content.replace(/import TextReveal from '.\/components\/effects\/TextReveal';\n/g, '');
content = content.replace(/import BorderBeam from '.\/components\/effects\/BorderBeam';\n/g, '');
content = content.replace(/import GrainOverlay from '.\/components\/effects\/GrainOverlay';\n/g, '');
content = content.replace(/import useParallax from '.\/hooks\/useParallax';\n/g, '');

// Strip useScrollReveal and its import
content = content.replace(/import useScrollReveal from '.\/useScrollReveal';\n/g, '');
content = content.replace(/useScrollReveal\(\);\n\s*/g, '');

// Strip hook calls
content = content.replace(/const magBtn1 = useMagneticHover\(15\);\n\s*/g, '');
content = content.replace(/const magBtn2 = useMagneticHover\(15\);\n\s*/g, '');
content = content.replace(/const parallaxOffset = useParallax\(0\.15\);\n\s*/g, '');

// Strip components
content = content.replace(/<SpotlightCursor[^>]*\/>\n\s*/g, '');
content = content.replace(/<GrainOverlay[^>]*\/>\n\s*/g, '');

// Replace TextReveal
content = content.replace(/<TextReveal as="h1" className="([^"]*)" text="([^"]*)" \/>/g, '<h1 className="$1">$2</h1>');
content = content.replace(/<TextReveal as="h2" className="([^"]*)" text="([^"]*)" \/>/g, '<h2 className="$1">$2</h2>');

// Strip classes
content = content.replace(/ cc-reveal/g, '');
content = content.replace(/ cc-delay-\d+/g, '');
content = content.replace(/ cc-magnetic/g, '');
content = content.replace(/ cc-shine/g, '');
content = content.replace(/ cc-slide-left/g, '');
content = content.replace(/ cc-slide-right/g, '');
content = content.replace(/ cc-perspective/g, '');
content = content.replace(/ cc-pulse-dot/g, '');

// Strip refs
content = content.replace(/ ref=\{magBtn1\}/g, '');
content = content.replace(/ ref=\{magBtn2\}/g, '');

fs.writeFileSync(file, content);
console.log('Stripped animations successfully!');
