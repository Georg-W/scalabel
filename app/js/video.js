/* global Sat SatImage */

/**
 * Class for each video labeling session/task, uses SatImage items
 * @param {SatLabel} LabelType: label instantiation type
 */
function SatVideo(LabelType) {
  let self = this;
  Sat.call(self, SatImage, LabelType);

  self.videoName = document.getElementById('video_name').innerHTML;
  self.frameRate = document.getElementById('frame_rate').innerHTML;
  self.frameCounter = document.getElementById('frame_counter');
  self.playButton = document.getElementById('play_button');
  self.playButtonIcon = document.getElementById('play_button_icon');
  self.slider = document.getElementById('video_slider');
  self.numFrames = self.slider.max;

  // initialize all of the items (SatImage objects, one per frame)
  for (let i = 1; i <= self.numFrames; i++) {
    let frameString = i.toString();
    while (frameString.length < 7) {
      frameString = '0' + frameString;
    }
    self.newItem('./frames/' + self.videoName.slice(0, -4) + '/f-' +
      frameString + '.jpg');
  }

  self.currentFrame = 0;
  self.currentItem = self.items[self.currentFrame];
  self.currentItem.setActive(true);
  self.currentItem.image.onload = function() {
    self.currentItem.redraw();};

  self.playing = false;
  self.playButton.onclick = function() {self.clickPlayPause();};

  self.slider.oninput = function() {self.moveSlider();};
}

SatVideo.prototype = Object.create(Sat.prototype);

SatVideo.prototype.newLabel = function(optionalAttributes) {
  let self = this;
  let labelId = self.newLabelId();
  let label = new self.LabelType(self, labelId, optionalAttributes);
  self.labelIdMap[label.id] = label;
  self.labels.push(label);
  for (let i = self.currentFrame; i < self.items.length; i++) {
    let childLabel = new self.LabelType(self, labelId, optionalAttributes);
    childLabel.parent = label;
    self.items[i].labels.push(childLabel);
    label.addChild(childLabel);
  }
  let currentFrameLabels = self.items[self.currentFrame].labels;
  return currentFrameLabels[currentFrameLabels.length - 1];
};

// TODO: this needs to be agnostic of label type!!!
// Right now it assumes SatImage is a Box2d
SatVideo.prototype.interpolate = function(startSatLabel) {
  let self = this;
  startSatLabel.keyframe = true;

  let priorKeyframe = null;
  let nextKeyframe = null;
  for (let i = 0; i < self.currentFrame; i++) {
    if (startSatLabel.parent.children[i].keyframe) {
      priorKeyframe = i;
      break;
    }
  }
  for (let i = self.currentFrame + 1;
    i < startSatLabel.parent.children.length; i++) {
    if (startSatLabel.parent.children[i].keyframe) {
      nextKeyframe = i;
      break;
    }
  }
  if (priorKeyframe !== null) {
    // if there's an earlier keyframe, interpolate
    for (let i = priorKeyframe; i < self.currentFrame; i++) {
      let weight = i/(self.currentFrame);
      // TODO: this is the part that makes too many assumptions (maybe)
      startSatLabel.parent.children[i].weightAvg(
        startSatLabel.parent.children[priorKeyframe], startSatLabel, weight);
    }
  }
  if (nextKeyframe !== null) {
    // if there's a later keyframe, interpolate
    for (let i = self.currentFrame + 1; i < nextKeyframe; i++) {
      let weight = (i - self.currentFrame) / (nextKeyframe - self.currentFrame);
      // TODO: this is the part that makes too many assumptions (maybe)
      startSatLabel.parent.children[i].weightAvg(startSatLabel,
        startSatLabel.parent.children[nextKeyframe], weight);
    }
  } else {
    // otherwise, just apply change to remaining items
    for (let i = self.currentFrame + 1;
      i < startSatLabel.parent.children.length; i++) {
      Object.assign(startSatLabel.parent.children[i], startSatLabel);
      startSatLabel.parent.children[i].keyframe = false;
    }
  }
};

SatVideo.prototype.clickPlayPause = function(e) {
  let self = this;

  if (e) {
    e.preventDefault();
  }

  // switch the play status
  self.playing = !self.playing;

  // update the icon and play/pause the vid
  if (self.playing) {
    self.playButtonIcon.className = 'fa fa-pause';
    self.intervalID = setInterval(function() {self.nextFrame();},
      1000/self.frameRate);
  } else {
    self.playButtonIcon.className = 'fa fa-play';
    clearInterval(self.intervalID);
  }
};

SatVideo.prototype.nextFrame = function() {
  let self = this;
  if (self.currentFrame < self.numFrames - 1) {
    self.currentFrame++;
    self.currentItem = self.items[self.currentFrame];
    self.slider.value = self.currentFrame + 1;
    self.frameCounter.innerHTML = self.currentFrame + 1;
    self.currentItem.setActive(true);
    self.items[self.currentFrame - 1].setActive(false);
    self.currentItem.redraw();
  } else {
    self.clickPlayPause();
  }
};

SatVideo.prototype.gotoItem = function(index) {
  let self = this;
  if (index >= 0 && index < self.items.length) {
    self.currentFrame = index;
    self.currentItem.setActive(false);
    self.currentItem = self.items[self.currentFrame];
    self.currentItem.setActive(true);
    self.currentItem.onload = function() {
      self.currentItem.redraw();
    };
    self.currentItem.redraw();
  }
};

SatVideo.prototype.moveSlider = function() {
  let self = this;
  let oldItem = self.currentItem;
  self.currentFrame = parseInt(self.slider.value) - 1;
  self.currentItem = self.items[self.currentFrame];
  self.currentItem.setActive(true);
  if (oldItem) {
    oldItem.setActive(false);
  }
  self.frameCounter.innerHTML = self.currentFrame + 1;
};