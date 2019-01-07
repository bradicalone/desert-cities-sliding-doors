'strict mode'

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

var _ = function(name){	
	var elem = document.getElementsByClassName(name)
	var classes = []
	for(var i = 0; i < elem.length; i++){
		classes.push(elem[i])
	}
	if(classes.length > 1){
		return classes;
	}else return classes[0];
};

var easeOut = function(progress){
	return Math.pow(--progress, 5) + 1;
};
(function(){
	var start;
	var toggle = false;
	
	var getPosition = function(el, elWidth){
		if(arguments.length === 1){
			var x = el.getBoundingClientRect().x;
			var halfWidth =  el.getBoundingClientRect().width / 2; 
			return {
				x: el.getBoundingClientRect().x,
				pos: x + halfWidth,
				width: el.getBoundingClientRect().width,
				height: el.getBoundingClientRect().height
			}
		}
		if(arguments.length === 2){
			var rootX = el.getBoundingClientRect().x;
			var rootHalfWidth = el.getBoundingClientRect().width / 2; //Gets location of Dropdown-root and adds current dropdown element / 2
			var rootTotal = rootX + rootHalfWidth;

			var elX = elWidth.getBoundingClientRect().x
			var  halfWidth = elWidth.getBoundingClientRect().width / 2; //Gets location of Dropdown-root and adds current dropdown element / 2
			var elTotal = elX + halfWidth;

			return  elTotal - rootTotal;
		} 
	};

	var hover = function(){
		
		var navHoverElem = ['services', 'company', 'gallery'],
		elemHide = [],
		elemActive,
		currentHide,
		currentWidth,
		elementWidth,
		arrowWidth,
		rootX,
		arrowX,
		widthDiff = 0,
		difference = 0,
		arrowDifference = 0,
		currentPos = 0,
		arrowCurrentTransform,
		lastArrowTransform,
		lastCardTransform,
		currentTransform,
		direction = "";
	

		var Mousemove = function(){
			var oldx = 0;
		    this.mousemovemethod = function (e) {
		        if( e.pageX < oldx ) {
		            direction = "left"
		        }else if( e.pageX > oldx ) {
		            direction = "right"
		        }
		        oldx = e.pageX;
			}
			return direction;
		};
		var mouseDirection = new Mousemove();
		document.addEventListener('mousemove', mouseDirection.mousemovemethod);

		_('primary').addEventListener('mouseover', function (e) {

			if(window.innerWidth < 910) return;
			if(e.target.className === "btn hover"){

				_('body-wrapper').style.display = 'block';
				//Removes all elemens from array on every hover
				elemHide.length = 0;
			
				var elemName = e.target.id;
				var compStyles = window.getComputedStyle(_( elemName ));
				var elementWidth = compStyles.getPropertyValue('width').replace(/px/,"");
				var elementHeight = compStyles.getPropertyValue('height').replace(/px/,"");

				var arrowWidth = window.getComputedStyle( _( 'dropdown-arrow' ) ).getPropertyValue('width').replace(/px/,"");
				
				for(var i = 0; i < navHoverElem.length; i++){
					//When nav item hovered over only that item z-index is changed
					if(elemName === navHoverElem[i]){
						elemActive = navHoverElem[i]
						_(elemActive).style.zIndex = '1'
					}else {
						elemHide.push( navHoverElem[i] )
						_( navHoverElem[i] ).style.zIndex = '0'
					}
				};
				
				function secondCall(timestamp){
				
					var runtime = timestamp - startTwo;
					var progress = easeOut(Math.min(runtime / 500, 1) );
					var x = Math.min(runtime / 100, 1);
						
					_('dropdown-root').style.width = parseInt(currentWidth) + (widthDiff * progress)+'px'
					_('dropdown-root').style.height = parseInt(currentHeight) + (heightDiff * progress)+'px'
					_('dropdown-arrow').style.transform = 'translate3d(' + ( arrowCurrentTransform + (arrowDifference * progress) )+'px,'+0+','+0+') rotate(45deg)';
					_('dropdown-root').style.transform = 'translate3d(' + ( currentTransform + (difference * progress) ) +'px, 0, 0)'+ 'perspective(2000px) rotateX(0deg)';
					
					if(progress < 1){
						requestAnimationFrame(function(timestamp){
							secondCall(timestamp)
						})
					} 
				};
					
				//Keeps secondCall() from being ran over and over if hovered over same button		
				if(toggle){
						
					if( _(elemActive).classList.contains('opacity') ) return

					rootX = getPosition( _('dropdown-root') ).x
					currentTransform = parseInt( _( 'dropdown-root' ).style.transform.replace(/translate3d\(-?(\d+\.?\d{1}?)([,.\d\w\)\s\-()]*)/gi,'$1') )
					console.log(_( 'dropdown-root' ).style.transform.replace(/translate3d\(-?(\d+\.?\d{1}?)([,.\d\w\)\s\-()]*)/gi,'$1'));
					difference = getPosition(e.target).pos - (rootX +  elementWidth / 2  );

					arrowX = getPosition( _('dropdown-arrow') ).x
					arrowCurrentTransform = parseInt( _( 'dropdown-arrow' ).style.transform.replace(/translate3d\((\d+\.?\d{1}?)([,\d\w\)\s\()]*)/gi,'$1') )
					arrowDifference = getPosition(e.target).pos - (arrowX +  arrowWidth / 2  );

					//Filter all but the last hidden element 
					var firstItem = elemHide.filter(function(item, i){
						if(i === 0 && elemActive === 'services') return item
						if(i === 1 && elemActive === 'gallery') return item
						if(i === 0 && elemActive === 'company' && direction === 'right') return item
						if(i === 1 && elemActive === 'company' && direction === 'left') return item
					});
					currentWidth = window.getComputedStyle( _( firstItem ) ).getPropertyValue('width').replace(/px/,"")
					currentHeight = window.getComputedStyle( _( firstItem) ).getPropertyValue('height').replace(/px/,"")
					widthDiff = window.getComputedStyle( _( elemActive ) ).getPropertyValue('width').replace(/px/,"") - window.getComputedStyle(_( firstItem )).getPropertyValue('width').replace(/px/,"")
					heightDiff = window.getComputedStyle( _( elemActive ) ).getPropertyValue('height').replace(/px/,"") - window.getComputedStyle(_( firstItem )).getPropertyValue('height').replace(/px/,"")
								
					requestAnimationFrame(function(timestamp){
						startTwo = timestamp;
						secondCall(timestamp)
					})
				};

				//Keeps secondCall() from being ran over and over if hovered over same button				
				_(elemActive).classList.add('opacity')
				elemHide.forEach(function(item){
					_(item).classList.remove('opacity');
				});

				function firstCall(){
					if(toggle ) return;
					toggle = true;

					if(!_('dropdown-root').hasAttribute('style') ){
						
						rootX = getPosition( _('dropdown-root') ).x 
						arrowX = getPosition( _('dropdown-arrow') ).x
						currentTransform = getPosition(e.target).pos - ( rootX +  elementWidth / 2  );
						arrowCurrentTransform = getPosition(e.target).pos - ( arrowX +  arrowWidth / 2  );
					};
					if(_('dropdown-root').hasAttribute('style') ){
						rootX = getPosition( _('dropdown-root') ).x
						currentTransform = parseInt( _( 'dropdown-root' ).style.transform.replace(/translate3d\(-?(\d+\.?\d{1}?)([,.\d\w\)\s\-()]*)/gi,'$1') )
						difference = getPosition(e.target).pos - (rootX +  elementWidth / 2  )
						arrowDifference = getPosition(e.target).pos - ( arrowX +  arrowWidth / 2  )
					};

					_('dropdown-root').style.height = compStyles.getPropertyValue('height');
					_('dropdown-root').style.width = compStyles.getPropertyValue('width');
					_('dropdown-arrow').style.transform = 'translate3d('+ (arrowCurrentTransform - (-arrowDifference)  )+'px, 0, 0) rotate(45deg)';
					_('dropdown-root').style.transform = 'translate3d('+ (currentTransform - (-difference)  ) +'px, 0, 100px)' + 'perspective(2000px) rotateX(-20deg)';
					currentTransform = parseInt( _( 'dropdown-root' ).style.transform.replace(/translate3d\(-?(\d+\.?\d{1}?)([,\d\w\)\s\-()]*)/gi,'$1') )
					arrowCurrentTransform = parseInt( _( 'dropdown-arrow' ).style.transform.replace(/translate3d\((\d+\.?\d{1}?)([,\d\w\)\s\()]*)/gi,'$1') )

					rootX = getPosition( _('dropdown-root') ).x
					arrowX = getPosition( _('dropdown-arrow') ).x					

					requestAnimationFrame(function(timestamp){
						start = timestamp;
						animateCardOnce(elemName, timestamp)
					})
				};
				firstCall();	

				function animateCardOnce(elemName,timestamp){
					_('body-wrapper').style.display = 'block';
					_('dropdown-root').style.zIndex = 1;
				
					var runtime = timestamp - start;
					var progress = Math.min(runtime / 400, 1) 
					var ease = easeOut(progress)

					_('dropdown-arrow').style.opacity = 1 * progress;
					_('dropdown-root').style.opacity = 1 * ease;
					_('dropdown-root').style.transform = 'translate3d('+ currentTransform +'px, 0, 100px)' + 'perspective(2000px) rotateX('+ (-20 + (20 * progress) ) +'deg)';
					_('dropdown-arrow').style.transform = 'translate3d('+ arrowCurrentTransform +'px,' + (-6 +(6* progress) ) +'px,0) rotate(45deg)';

					if(elemActive === 'services') _('dropdown-arrow').style.transform = 'translate3d('+ arrowCurrentTransform +'px,' + (-20 +(20* progress) ) +'px,0) rotate(45deg)';
			
					if(ease < 1){
						requestAnimationFrame(function(timestamp){
							animateCardOnce(elemName,timestamp)
						})
					}
				}
			};

			function animateCardAway(){
		
				_('body-wrapper').addEventListener('mouseover', function(e){
					if(e.target){
						_('body-wrapper').style.display = "none";

						toggle = false;
						lastArrowTransform = parseInt( _( 'dropdown-arrow' ).style.transform.replace(/translate3d\((\d+\.?\d{1}?)([,\d\w\)\s\()]*)/gi,'$1') )
						lastCardTransform = parseInt( _( 'dropdown-root' ).style.transform.replace(/translate3d\(-?(\d+\.?\d{1}?)([,.\d\w\)\s\-()]*)/gi,'$1') )
					
						requestAnimationFrame(function(timestamp){
							start = timestamp;
							animateCard(timestamp)
						})
					}
				})	
			}; 
			animateCardAway()
			//Added ease for dropdown arrow
			
			function animateCard( timestamp){
				var runtime = timestamp - start;
				var progress = Math.min(runtime / 400, 1) 
				var ease = easeOut(progress)
			
				if(elemActive === 'services')  _('dropdown-arrow').style.transform = 'translate3d('+ lastArrowTransform  +'px,' + (0 +(-15* ease) ) +'px,0) rotate(45deg)';
				if(elemActive === 'company' || elemActive === 'gallery') _('dropdown-arrow').style.transform = 'translate3d('+ lastArrowTransform+'px,' + -5 * ease +'px,'+ 0 +'px) rotate(45deg)';
		
				_('dropdown-root').style.transform = 'translate3d('+ lastCardTransform  +'px, 0, 100px)' + 'perspective(2000px) rotateX('+ (0 - (20 * ease) ) +'deg)';
				_('dropdown-root').style.opacity = 1 - 1 * ease;
				_('dropdown-arrow').style.opacity = 1 - (1 * ease);
					
				if(ease < 1){
					requestAnimationFrame(function(timestamp){
						animateCard(timestamp)
					})
				}else{
					// 
					_('dropdown-root').style.zIndex = -1;
					if(_('body-wrapper').style.display === 'block') _('body-wrapper').style.display = 'none'
				} 
			}
		})
	};
	hover();

	 
	var inputFade = function(){
		var scroll = 0;
		var opac=1;
	
		window.addEventListener('scroll', function(e) {
			var navMain = _('nav-main').getBoundingClientRect().top;
			var navbar = _('navbar').getBoundingClientRect().top;
			// console.log( _('navbar').getBoundingClientRect().height);

			var direction = 1 - (window.pageYOffset || document.documentElement.scrollTop);
			// var direction = 1 - (window.pageYOffset || document.documentElement.scrollTop /.01) /100;
				// console.log(_('dropdown-root').getBoundingClientRect().y);

			if(direction < -55 ){
				// _('dropdown-root').style.position = 'fixed'
				// _('dropdown-root').style.top = '80px'
				// _('deals').style.top = '60px'
				
				// _('nav-main').style.position = 'fixed'
				// _('nav-main').style.top = '20px'

			}
			if(direction > -55 && _('nav-main').style.position == 'fixed'){
				// _('dropdown-root').style.position = 'absolute'
				// _('dropdown-root').style.top = "128px"
				// _('nav-main').style.position = 'relative'
				// _('deals').style.top = '-60px'
			
			}
		})
	}
	// inputFade()

	
	function sideNav(){	
		var glyphicon = document.querySelectorAll('.glyphicon, .back');
		var dist;
		var currentPos;

		var animateNav = function(currentPos, timestamp){
			var runtime = timestamp - start;
			var progress = Math.min(runtime / 800, 1) 
			var ease = easeOut(progress)
	
			// console.log('translateX('+ ( currentPos - (dist*ease) ) + 'px)');
			_('body-container').style.transform = 'translateX('+ ( currentPos - (dist*ease) ) + 'px)'
			_('nav-main').style.transform = 'translateX('+ ( currentPos - (dist*ease) ) + 'px)'
			_('navbar').style.transform = 'translateX('+ ( currentPos - (dist*ease) ) + 'px)'

			if(ease < 1){
				requestAnimationFrame(function(timestamp){
					animateNav(currentPos, timestamp)
				})
			}
		}
		
		for(var i = 0; i < glyphicon.length; i++){
			glyphicon[i].addEventListener('click', function(e){
				if(window.innerWidth > 910) return

				currentPos = _('navbar').getBoundingClientRect().x

				if(this === _('navbar').childNodes[1] || this.classList[0] == 'back'){
					_('navbar').childNodes[1].style.display = "none";
					_('navbar').childNodes[3].style.display = "block";
					dist = -330;
					//Closes any submenu items still open
					menu.closeAll()
				}
				if(this === _('navbar').childNodes[3] ){
					_('navbar').childNodes[3].style.display = "none";
					_('navbar').childNodes[1].style.display = "block";
					dist = 330;
				}
				requestAnimationFrame(function(timestamp){
					start = timestamp
					animateNav(currentPos, timestamp)
				})
			})
		}
	}
	sideNav()

	var Submenu = function(){
		var $this = this;
		this.item = _('btn hover');
		this.cardItem = _('card-info')
		this.start = 0;
		this.toggle = false;
		this.height = 0;
		this.submenu = [];
		this.submenuHeight = function(){
			return this.submenu[0].getBoundingClientRect().height
		}
		this.animate = function(timestamp){
			
			var runtime = timestamp  - ( $this.start || ($this.start = timestamp ) )
			var progress = easeOut( Math.min(runtime / 600, 1) )
			if($this.toggle){
				$this.submenu[0].style.height = $this.height * progress +'px'
			}
			if(!$this.toggle){
				$this.submenu[0].style.height = $this.height - ($this.height * progress) +'px'
			}
			if(progress < 1){
				requestAnimationFrame( $this.animate )
			}
		}
		this.menuClick = function(){
			for(var i = 0; i < 3; i++){
			
				this.item[i].addEventListener('click', function(){
					$this.submenu.length = 0;
					$this.submenu.push( this.nextElementSibling )
					$this.height = this.nextElementSibling.children[0].getBoundingClientRect().height;
					if($this.submenuHeight() <= 0){
						$this.toggle = true;
					}
					if($this.submenuHeight() > 0){
						$this.toggle = false;
					}
					requestAnimationFrame(function(timestamp){
						$this.start = timestamp
						$this.animate(timestamp)
					})
				})
			}	
		}
		//Closes any submenu that is open when closing navigation
		this.closeAll = function(){
			var back = _('submenu');
			for(var i = 0; i < back.length; i++){
				back[i].removeAttribute('style');
			}
		}
	};
	Submenu.prototype.cardClick = function(){
		var $this = this;
		if(!_('service')) return;
		for(var i = 0; i < this.cardItem.length; i++){
			this.cardItem[i].addEventListener('click', function(e){
				$this.submenu.length = 0;
				$this.submenu.push(this.children[3]);
				$this.height = this.children[3].children[0].getBoundingClientRect().height;

				if($this.submenuHeight() === 0){
					$this.toggle = true;
				}
				if($this.submenuHeight() > 0){
					$this.toggle = false;
				}
				requestAnimationFrame(function(timestamp){
					$this.start = timestamp
					$this.animate(timestamp)
				})
			})
		}
	}
	var menu = new Submenu()

	menu.menuClick()
	menu.cardClick()

	function resize(resizedWidth){
		window.addEventListener('resize',function(){
				if(window.innerWidth > 910){
					// _('dropdown-root').style.cssText = "";
					// _('dropdown-root').removeAttribute('style')
					// _('dropdown-arrow').removeAttribute('style')
				// if(window.innerWidth > 768){
					_('nav-main').style = ""
					_('navbar').style = ""
					_('body-container').style = ""
				 	_("glyphicon glyphicon-menu-hamburger").style.display = "none"
				 	_("glyphicon glyphicon-remove").style.display = "none"

				}if(window.innerWidth < 910) {

					if(_("glyphicon glyphicon-remove").style.display == "none"){
						_("glyphicon glyphicon-menu-hamburger").style.display = "block"
					}
				}
			})
			return window.innerWidth;
		}
	resize(window.innerWidth)
})();

/***   INTRO WINDOW OPEN AND CLOSE  ***/

window.onload = function(){
	var handle = _('handle')
	//For all other pages that don't use the intro svg 
	if(handle === undefined) return
	handle.classList.add('rotate');
	handle.addEventListener('transitionend', function(){
		var rotate = {
			start: 0,
			windowMove: function(timestamp){
				var runtime =  timestamp - rotate.start;
				var progress = easeOut( Math.min(runtime / 1500, 1) )
				if(window.innerWidth < 768) {
					_('border-top-bottom').style.transform = 'translate3d('+(42.5*progress)+'%,0,0)';
				}
				else _('border-top-bottom').style.transform = 'translate3d('+(40.5*progress)+'%,0,0)';
				_('door left').style.transform = 'translate3d('+( 0 + (75*progress) )+'%,0,0)';
		
				if(progress < 1){
					requestAnimationFrame(rotate.windowMove)
				}else {
					requestAnimationFrame(function(timestamp){
						rotate.start = timestamp;
						rotate.windowMoveTwo(timestamp)
					});
					return false;
				}
			},
			windowMoveTwo: function(timestamp){
				var runtime =  timestamp - rotate.start;
				var progress = easeOut( Math.min(runtime / 1500, 1) ).toFixed(3)
				if(progress < 1 && window.innerWidth > 768){
					_('door right').style.transform = 'translate3d('+( 0 + (88*progress) )+'%,0,0)';
					_('door left').style.transform = 'translate3d('+( 75 + (75*progress) )+'%,0,0)';
					_('border-top-bottom').style.transform = 'translate3d('+ ( 40.5+ (40*progress ) )+'%,0,0)';
				}
				if(progress < 1 && window.innerWidth < 768){
					_('door right').style.transform = 'translate3d('+( 0 + (80*progress) )+'%,0,0)';
					_('door left').style.transform = 'translate3d('+( 75 + (65*progress) )+'%,0,0)';
					_('border-top-bottom').style.transform = 'translate3d('+ ( 41.5+ (36*progress ) )+'%,0,0)';
				}
				if(progress > .99){
					
					_('intro').classList.add('introFadeOut');
					_('intro').addEventListener('transitionend', function(){
					_('intro').style.display = "none"
					
					})
					return false;
				}
				rotate.animation = requestAnimationFrame(rotate.windowMoveTwo)
			},
			animate: requestAnimationFrame(function(timestamp){
				rotate.start = timestamp;
				rotate.windowMove(timestamp)
			})
		}
	}, false);
};







