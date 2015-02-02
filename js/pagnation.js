$(function(){

/***********************************************
	
	Function:	Pagnation
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
	
*************************************************/
	
function preload(imageArray)
{
	var images = [];
	
	window.onload = function()
	{
		for (var i = 0; i < imageArray.length; i++)
		{
			images[i] = new Image();
			images[i].src = imageArray[i];
		}
	};
}

var mediumImages = [
			'img/medium/1.jpg',
			'img/medium/2.jpg',
			'img/medium/3.jpg',
			'img/medium/4.jpg',
			'img/medium/5.jpg',
			'img/medium/6.jpg',
			'img/medium/7.jpg',
			'img/medium/8.jpg',
			];
preload(mediumImages);
	
/***********************/

function ListBuild(wrap, template, images, el)
{
	this.wrap = wrap;
	this.template = template;
	this.images = images;
	this.el = el;
	
	var pagnationButtons = 0,
		pageLinks = [];
	
	function preLoadImages()
	{
		preload(images);
	}
	
	function setRange()
	{
		var itemsPerPage = images.length/el,
			first = 0;
		buildPage(first, el, itemsPerPage);
		preLoadImages();
	}
	
	function buildPage(first, last, itemsPerPage)
	{
		function itemCreate(i,type)
		{
			var	obj = wrap.find(template).clone(),
				img = obj.find('img'),
				a = obj.find('a');
				
			img.attr('src', images[i]);	
			a.attr({'href':i,'data-img':i});
			obj.removeClass(type).attr('id','item-'+i);
			wrap.append(obj);
		}
		
		for(var i = first; i < last; i++)				
		{
			itemCreate(i,'template hidden');
		}
		
		for(var j = last; j < images.length; j++)
		{
			itemCreate(j,'template');
		}
		
		wrap.find(template).remove();
		buildPagnation(first, last, itemsPerPage);
	}
	
	function buildPagnation(first, last, itemsPerPage)
	{ 
		buildButton(true,'prev');
		var target = images.length/el;
		
		for(var i = 0; i < target; i++)
		{
			if(i == 1)
			{
				buildButton(false,'spacerLeft');
			}
			
			if(i == parseInt(target))
			{
				buildButton(false,'spacerRight');
			}
			
			buildButton(true,i+1);
			pagnationButtons = pagnationButtons+1;
			
		}
		
		$('#pagn-1').addClass('selected');					
		buildButton(true,'next');
		
		newPage(first,last);
		hideNav(pageLinks);
		
	}

	function buildButton(active,dataCount)
	{
		var spanClass = '',
			button = document.createElement('li'),
			span = document.createElement('span'),
			html = dataCount,
			place = dataCount,
			margin = '.5em';
			
		switch(dataCount)
		{
			case 'prev': 
				spanClass = '';
				html = '&lt;';
				place = 'prev';
				margin = '0';
			break;
			
			case 'next':
				 spanClass = '';
				 html = '&gt;';
				 place = 'next';
			break;
			
			case 'spacerLeft':
				html = '...';
			break;
			
			case 'spacerRight':
				html = '...';
			break;
		}	
		
		$(span).addClass(spanClass).html(html);
		$(button).css('margin-left',margin).append(span).attr({'data-place':place, 'id': 'pagn-'+place});
		
		if(!active)
		{
			$(button).addClass('inactive');
		}
		
		wrap.next('.pagnation').append(button);
	}
	
	function hideNav(pageLinks)
	{ 
		if(5 > pagnationButtons)
		{
			$('#pagn-spacerLeft').addClass('hidden');
			$('#pagn-spacerRight').addClass('hidden');
			return;
		}
		
		pageLinks = [];
		
		$('.pagnation li').each(function()
		{
			var id = $(this).attr('id'),
				selected = $(this).hasClass('selected');
			pageLinks.push({'ID': id, 'Selected': selected});
			return pageLinks;
		});
		
		$('#pagn-prev').removeClass('inactive');
		$('#pagn-next').removeClass('inactive');
		
		for(var i = 0; i < pageLinks.length; i++)
		{	
			if(pageLinks[i].Selected && pageLinks[i].ID == 'pagn-1')
			{	
				$('#pagn-prev').addClass('inactive');
			}
			if(pageLinks[i].Selected && pageLinks[i+1].ID == 'pagn-next')
			{
				$('#pagn-next').addClass('inactive');
			}
		}
		
		if(pageLinks[1].Selected || pageLinks[3].Selected || pageLinks[4].Selected)
		{
			$('#pagn-spacerLeft').addClass('hidden');
			$('#pagn-spacerRight').removeClass('hidden');
			for(var j = 0; j < pageLinks.length; j++)
			{
				if(j < 5)
				{
					$('#pagn-' + j).removeClass('hidden');
				}
				if (j >= 5 && j < pageLinks.length-4)
				{
					$('#pagn-' + j).addClass('hidden');
				}
			}
			return;
		}
		
		else if(pageLinks[pageLinks.length-2].Selected || pageLinks[pageLinks.length-4].Selected || pageLinks[pageLinks.length-5].Selected) 
		{
			$('#pagn-spacerLeft').removeClass('hidden');
			$('#pagn-spacerRight').addClass('hidden');
			for(var k = 0; k < pageLinks.length; k++)
			{
				if(k > pageLinks.length-8)
				{
					$('#pagn-' + k).removeClass('hidden');
				}
				if(k > 1 && k < pageLinks.length-7)
				{
					$('#pagn-' + k).addClass('hidden');
				}
			}
			return;
		}
		
		else 
		{
			$('#pagn-spacerLeft').removeClass('hidden');
			$('#pagn-spacerRight').removeClass('hidden');
			
			for(var l = 0; l < pageLinks.length; l++)
			{
				if(l > 1 && l < pageLinks.length-4)
				{
					$('#pagn-' + l).addClass('hidden');
				}
			}
			
			for(var m = 0; m < pageLinks.length; m++)
			{
				if(pageLinks[m].Selected)
				{
					$('#pagn-' + parseInt(m-1)).removeClass('hidden');
					$('#pagn-' + parseInt(m-2)).removeClass('hidden'); 
					$('#pagn-' + parseInt(m)).removeClass('hidden');
				}
			}
						
		}
	}
	
	function newPage(first,last)
	{
		function exportResults(first, last)
		{
			showHide(first, last);
			hideNav(pageLinks);
			wrap.parent().fadeIn(400);
			return;
		}
		
		$('.pagnation').on('click','li', function()
		{
			wrap.parent().fadeOut(400);
			
			var obj = $(this),
				place = obj.attr('data-place');
			
			setTimeout(function()
			{
				if(place != 'next' && place != 'prev')
				{
					$('.pagnation li').removeClass('selected');
					obj.addClass('selected');
					first = (el * place)-el;
					last = first + el;
					exportResults(first, last);
					return;
				}
				
				var selected = $('.pagnation').find('.selected');
				selected.removeClass('selected');
				
				if(place == 'next')
				{
					var next = selected.next('li'),
						id = next.attr('id');
						
					if(id == 'pagn-spacerRight' || id == 'pagn-spacerLeft')
					{
						next.next('li').addClass('selected');
						place = next.next('li').attr('data-place');
					}
					else
					{
						selected.next('li').addClass('selected');
						place = selected.next('li').attr('data-place');
					}
					
					first = (el * place)-el;
					last = first + el;
					exportResults(first, last);
					return;
				}
				
				if(place == 'prev')
				{
					var prev = selected.prev('li'),
						idPrev = prev.attr('id');
					if(idPrev == 'pagn-spacerRight' || idPrev == 'pagn-spacerLeft')
					{
						prev.prev('li').addClass('selected');
						place = prev.prev('li').attr('data-place');
					}
					else
					{
						selected.prev('li').addClass('selected');
						place = selected.prev('li').attr('data-place');
					}
					
					first = (el * place)-el;
					last = first + el;
					exportResults(first, last);
					return;
				}
			},400);
			
		});
	}
	
	function showHide(first, last)
	{
		wrap.children('li').addClass('hidden');
		for(var i = first; i < last; i++)
		{
			var id = $(document.getElementById('item-' + i));
			id.removeClass('hidden');
		}				
	}
		
	this.init = function()
	{
		setRange();
	};
	
}	

function squareList(wrap,template,images,el)
{
	var instance = new ListBuild(wrap,template,images,el);
	return instance;
} 

var bgList = squareList($('#wrap'),
						'.template', 
						['img/small/1.jpg',
						'img/small/2.jpg',
						'img/small/3.jpg',
						'img/small/4.jpg',
						'img/small/5.jpg',
						'img/small/6.jpg',
						'img/small/7.jpg',
						'img/small/2.jpg',
						'img/small/3.jpg',
						'img/small/4.jpg',
						'img/small/5.jpg',
						'img/small/6.jpg',
						'img/small/7.jpg',
						'img/small/2.jpg',
						'img/small/3.jpg',
						'img/small/4.jpg',
						'img/small/5.jpg',
						'img/small/6.jpg',
						'img/small/7.jpg',
						'img/small/8.jpg',
						'img/small/9.jpg',
						'img/small/10.jpg',
						'img/small/11.jpg',
						'img/small/7.jpg',
						'img/small/8.jpg',
						'img/small/9.jpg',
						'img/small/10.jpg',
						'img/small/11.jpg',
						'img/small/7.jpg',
						'img/small/8.jpg',
						'img/small/9.jpg',
						'img/small/10.jpg',
						'img/small/11.jpg',
						'img/small/4.jpg',
						'img/small/5.jpg',
						'img/small/6.jpg',
						'img/small/7.jpg',
						'img/small/8.jpg',
						'img/small/9.jpg',
						'img/small/10.jpg',
						'img/small/11.jpg',
						'img/small/12.jpg',],
						9
						);	

bgList.init();
	
/***********************/
	
});