# Adapt SVG

**Adapt SVG** is a *presentational component* that renders Lottie animations exported from Adobe After Effect using the Bodymovin plugin.

Uses v5.7.6 of Lottie.

## Settings Overview

The attributes listed below are used in *components.json* to configure **Adapt SVG**, and are properly formatted as JSON in [*example.json*](https://github.com/cgkineo/adapt-svg/blob/master/example.json).

### Attributes

**\_animation** (object): It contains values for **\_src**, **\alt**, **\description**, **\attribution**, **\_loops**, **\_autoPlay**, **\_onScreenPercentInviewVertical**, **\_offScreenPause**, **\_offScreenRewind**, **\_showPauseControl**, **\_onPauseRewind**, **\_renderer**

>**\_src** (String): Set the path to the Bodymovin export file or folder. A folder should contain the animation *data.json* file plus any associated static images in an *images* folder (if applicable). A file should contain just the animation *data.json*.

>**\alt** (String): The short alternative text for the animation.

>**\description** (String): A longer description of the animation to be used when the animation content is not described in adjacent text.

>**\attribution** (String): Text to be displayed as an attribution of animation.

>**\_loops** (Number): Controls how many times the animation should loop. To set an infinite loop, use a value of `-1`. Defaults to `0` (don't loop).

>**\_autoPlay** (Boolean): Should the animation play when on screen. Note: Percentage onscreen determines when autoplay occurs. Defaults to `true`.

>**\_onScreenPercentInviewVertical** (Number): What percentage of the SVG container should be on-screen before the animation is triggered. Defaults to `1`.

>**\_offScreenPause** (Boolean): Pause when off screen. Defaults to `true`.

>**\_offScreenRewind** (Boolean): Rewind when off screen. Defaults to `true`.

>**\_showPauseControl** (Boolean): Show the play / pause button. Defaults to `false`.

>**\_onPauseRewind** (Boolean): Rewind when the pause button is clicked. Defaults to `false`.

>**\_renderer** (String): Sets which renderer to use. Acceptable values are `svg` `canvas` and `html` - default should be `svg` when using vector based animation and `canvas` if animation is comprised of just images. Defaults to `"svg"`.

**\_fallback** (object): It contains values for **\_src**, **\alt**, **\description**, **\attribution**

>**\_src** (String): Set the path for a fallback graphic.  

>**\alt** (String): The short alternative text for the fallback graphic.

>**\description** (String): A longer description of the fallback graphic to be used when the graphic content is not described in adjacent text.

>**\attribution** (String): Text to be displayed as an attribution of fallback graphic.

## Limitations

* Not yet been stress tested

----------------------------
**Version number:**  3.0.0
**Framework versions:**  >=5   
**Author / maintainer:** Kirsty Hames / Kineo   
**Accessibility support:** WAI AA   
**RTL support:** Yes   
**Cross-platform coverage:** Evergreen + IE11   

----------------------------

# Adapt SVG


## What I’m trying to do

### Objectives:
- Animated svgs as content graphics.
    - Start with content graphic component.
    - Other components can then be created adapt-svg-hotgraphic etc
    - Future intentions - event based animations (capture click / in view etc)

### SVG examples - what I’m trying to achieve
- SVG’s (show process with hotspots) https://weima.com/us/
- SVG’s (show process with hotspots) http://pharmafilter.nl/en/
- Illustration style (canvas step-by-step - do similar with svg) - https://www.threecents.co.uk/
- SVG’s as background/supporting graphics http://kasko.arsenal-ic.ua/#screen1
- SVGs in place of static graphics - fluid timeline https://portion.io/
- SVGs in place of static graphics https://waaark.com/vision/

### Current steps:
- Research into js libraries available
- Document pro’s / cons of libraries
- Create test cases - keep iterations and document
(Test case 20 svgs in a single page - check performance in debugger)
- Look into production process - how much time is spent between designer and graphics etc (inc amends / rework etc)



## Why SVGs

- Svgs are xml tags that can be interacted with and animated like html elements
- Resolution-independent - Scalable and high image quality
- You can compress (Gzipped)
- Interactive and styleable with css and javascript
- Built in graphics effects - Photoshop editing / filters etc
- Many tools available for creating, editing and optimising



## Moving forward

- Test use cases of multiple ani actions on different browsers/devices
- Get graphics to produce a complicated svg (diagram etc)
- Compare desktop to mobile svg rendering  - how it renders different shapes etc
- Compare different svg exports from different libraries
- Look into configurations and what we need
- How do configurations have a impact on load times
- Json to text experiment
- Upload to QA site



## Libraries for SVG

#### Lottie.js - http://airbnb.io/lottie/web/web.html

    - export plugin available for Adobe After Effects - exports as json
	(Bodymovin https://www.adobeexchange.com/creativecloud.details.12557.html)
    - designed for Android and iOS

GitHub - https://github.com/airbnb/lottie-web
	- open source and free
	- good documentation, regular updated (most recent)


#### Snap.svg - developed from Raphael http://snapsvg.io/
	- export plugin available for Adobe Animate

Git hub -https://github.com/adobe-webplatform/Snap.svg/
	- open source and free
	- good documentation, regularly updated


### Ruled out libraries

#### Bonsai.js - https://bonsaijs.org/
	-  graphics API and an SVG renderer
	- open source
	- web based project from web dev company http://www.uxebu.com
	- git repo -  https://github.com/uxebu/bonsai
	- last commit Aug
	- author uxebu are the only contributors
	- js animations no current plugins for exporting svgs in animation creation softwares (Adobe) - not fit for our production

#### SVG.js - http://svgjs.com/

Git hub - https://github.com/svgdotjs/svg.js
	- ongoing project since 2014 and regular updated (last commit Aug 30th)
	- good documentation, regular updated
	- lots of contributors
	- create svgs in js only, no Adobe plugins available!

Free and open sourced - https://github.com/svgdotjs/svg.js/blob/master/LICENSE.txt

Lightweight (half of Snap.js)
	- 137k source
	- 62.8k minified
	- 16.3k gzipped

Fast (like a quarter of Snap.js)
	- 116ms rects
	- 274ms fill
	- 856ms gradient

#### Paper.js - canvas manipulation rather than svg

#### Raphael - wider/legacy browser support so heavy

#### Two.js - canvas manipulation rather than svg

#### Virus.js / lazy line painter / walkway - limited to path (drawing) animations only



## API configurations

Configurations to implement (based on similar Adapt functionality - media component / video background etc):
~~_setCompletionOn: inview / play / ended~~
_isLooped
~~_offScreenPause~~
~~_offScreenRewind~~
~~_showControls~~
_showScrubBar
~~_autoPlay~~
_autoPlayAfterFinished
_ratio
_preventForwardScrubbing
_allowFullScreen
Transcript? CC?

** API https://airbnb.io/lottie/web/getting-started.html#usage **

## Things to know:

- Bodymovin plugin export options/configurations? (Loop, ratio etc)
- What programs graphics currently use for animation creation? Flash animate originally now using after effects. Lottie requires after effects.

## Assets needed:

- SVG diagram
- Simple decorative SVGs
- More complex SVG (perhaps re-purpose an existing animation)

We’ll probably need to test exporting these with other library plugins to test optimisation.

Snap.svg http://snapsvg.io/

Vectors vs images

For me to read:

https://www.creativebloq.com/how-to/export-after-effects-animations-to-html5
