let selected = -1; // no filter chosen

//filter images
function preload()
{
  imgSpidey = loadImage("/media/spiderman.png");
  imgBatman = loadImage("/media/batman.png");
  imgMask = loadImage("/media/mask.png");
  imgGlasses = loadImage("/media/glasses.png")
}

function setup()
{
  const maxWidth = Math.min(windowWidth - width / 2, windowHeight - height / 2);
  pixelDensity(1);
  outputWidth = maxWidth;
  outputHeight = maxWidth / 1.5 ;
  const canvas = createCanvas(outputWidth, outputHeight)
  canvas.style('margin-top', '-25px')
//cam video
  videoInput = createCapture(VIDEO);
  videoInput.size(outputWidth, outputHeight);
  videoInput.hide();


// dropdown options and select filter
  dropDown = createSelect();
  const options = ['Blur', 'Intense', 'Batman', 'Mask', 'Glasses', 'Spiderman']; 
  dropDown.option('Select Filter', -1); 
  for (let i = 0; i < options.length; i++)
  {
    dropDown.option(options[i], i);
  }
  dropDown.changed(applyFilter);

//Styles for select
  dropDown.style('padding', '10px')
  dropDown.style('margin-bottom', '10px')

//Button and styles
  button = createButton('Take photo');
  button.style('margin-bottom', '10px')
  button.mousePressed(takePhoto)

// face tracker
  faceTracker = new clm.tracker();
  faceTracker.init();
  faceTracker.start(videoInput.elt);
}

function applyFilter()
{
  selected = this.selected(); 
}

function draw()
{
  image(videoInput, 0, 0, outputWidth, outputHeight); 
  switch(selected)
  {
    case '-1': 
    break;
    case '0': blurFilter(); 
    break;
    case '1': intenseFilter(); 
    break;
    case '2': batmanMask(); 
    break;
    case '3': bigMask();  
    break;
    case '4': glassesFilter(); 
    break;
    case '5': spiderman(); 
    break;
    case '6': glassesFilter(); 
    break;
  }  
}

// the number model for coordinates https://github.com/auduno/clmtrackr
// All filters
function spiderman()
{
  const positions = faceTracker.getCurrentPosition();
  if (positions !== false)
  {
    push();
    const faceWidth = Math.abs(positions[13][0] - positions[1][0]) * 1.2; //face width
    const faceHeight = Math.abs(positions[7][1] - Math.min(positions[16][1], positions[20][1])) * 1.2; // nose to chin
    translate(-faceWidth/2, -faceHeight/2);
    image(imgSpidey, positions[62][0], positions[62][1], faceWidth, faceHeight); //center of the face
    pop();
  }
}
function batmanMask(){
  const positions = faceTracker.getCurrentPosition()
  if (positions !== false)
  {
    push();
    const faceWidth = Math.abs(positions[13][0] - positions[1][0]) * 2.5; 
    const faceHeight = Math.abs(positions[7][1] - Math.min(positions[16][1], positions[0][1])) * 1.5; 
    translate(-faceWidth/2, -faceHeight/1.6);
    image(imgBatman, positions[33][0], positions[33][1], faceWidth, faceHeight); 
    pop();
  }
}

function bigMask(){
  const positions = faceTracker.getCurrentPosition()
  if (positions !== false)
  {
    push();
    const faceWidth = Math.abs(positions[13][0] - positions[1][0]) * 1.3; 
    const faceHeight = Math.abs(positions[7][1] - Math.min(positions[16][1], positions[20][1])) * 1.2;
    translate(-faceWidth/3.2, -faceHeight/1.9);
    image(imgMask, positions[27][0], positions[32][1], faceWidth, faceHeight); 
    pop();
  }
}

function glassesFilter(){
  const positions = faceTracker.getCurrentPosition()
  if (positions !== false)
  {
    push();
    const faceWidth = Math.abs(positions[14][0] - positions[1][0]) * 1.2;
    const faceHeight = Math.abs(positions[7][1] - Math.min(positions[16][1], positions[20][1])) * 1.4; 
    translate(-faceWidth/3, -faceHeight/2.4);
    image(imgGlasses, positions[27][0], positions[32][1], faceWidth, faceHeight); 
    pop();
  }

}

function blurFilter(){
 filter(BLUR, 3);
}

function intenseFilter(){
  filter(POSTERIZE, 3);
}
function takePhoto(){
  saveCanvas('nice pic', 'jpeg')
}

//Responsiveness
function windowResized()
{
  const maxWidth = Math.min(windowWidth, windowHeight);
  pixelDensity(1);
  outputWidth = maxWidth / 1.2;
  outputHeight = maxWidth / 1.2; 
  resizeCanvas(outputWidth, outputHeight);
}