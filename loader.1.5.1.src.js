/*
   Version : 1.5.1
   Author  : xrmx
   Date Last modified : 21/08/2011
 
  Install Instructions
  --------------------
  Copy this code below into a new brower's bookmark on the tool bar.
 
---- BEGIN COPY ----
javascript:(function(){var jsCode = document.createElement('script');jsCode.setAttribute('src','http://www.xrmx.co.uk/bookmarklets/hacktheplanet/loader.min.js');document.body.appendChild(jsCode);}());
----- END COPY -----

Minify the source here : http://javascriptcompressor.com/ 

Images encoded here :  http://www.greywyvern.com/code/php/binary2base64

Todo
----
 - Add fancy terminal and emulatre a old style term
 - Find out all the hacking mission id's
 - Show what targets u are hacking and hp etc..
 - Show a quick summery of what happened in the round 

Version History 
---------------
1.4 - Added Freelance missions
    - Added verison number to gui
	
1.3 - Added Auto hacking more tidy and able to rehack when your AP's get to zero, it waits for 30 mins.
    - Checks the host locaiton to make sure the site is hacktheplanet.no otherwise promps for redirect.
	
1.2 - Added jQuery animate so it resizes the bookmarklet when if finds new items in the mission.

1.1 - Added Styling and auto hide minimise bookmarklet

1.0 - Added mission hacking
*/ 


// Define Bookmarklet Globals
var minMaxBookmarklet = 0;
var useAttackPointsAutoHack = 0;
var runningHack = false;
var cursor; /* term global variable */

// Check to see if jQuery is loaded otherwise load it and then call the htpBookmarklet function  
// to start the bookmarklet.
if (!($ = window.jQuery)) { // typeof jQuery=='undefined' works too
	var script = document.createElement('script');
	script.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
	script.onload = htpBookmarklet;
	document.body.appendChild(script);
} else {
	htpBookmarklet();
	init_terminal();
}

function htpBookmarklet() {
	
	// Check that we are on HTP domain otherwise prompt and redirect
	if (location.host.split(".")[0]!="hacktheplanet") {
		var reply = prompt("Yo you n00b!!\n This only works on the hacktheplanet.no site\n You want me to load it up for you? (y/n) \n", "");
		// alert('Hack the planet\'s site not found, now taking you there... Please go to http://hacktheplanet.no to use this bookmarklet');
		if (reply == 'y' || reply == 'Y') {
			alert('Now taking you to hacktheplanet.no. \nYou will have to click on the bookmakrlet again once the site loads'); 
			location.href = 'http://hacktheplanet.no';
		} else { 
			return false;
		}
	}

	// Removes any pre loaded interfaces
	$("#HackThePlanetBookmarklet").animate({"visability": "hiddden"}, "8000");
	$('#HackThePlanetBookmarklet').remove();
	
	// Prepare and render the interface
	var timenow = new Date().getTime(), html; // for no-caching
	
	html += '<style type="text/css"> \n';
	html += '#HackThePlanetBookmarklet {\n';
	html += '	position:fixed;\n';
	html += '	left:0;\n';
	html += '	bottom:0;\n';
	html += '	color:#fff;\n';
	html += '	background:#000;\n';
	html += '	border:solid 1px #787878;\n';
	html += '	width:800px;\n';
	//html += '	width:1200px;\n';
	//html += '	height:330px;\n';
	html += '	z-index:9000;\n';
	html += '}\n';

	html += '#HackThePlanetBookmarklet .toolBelt {\n';
	html += '	width:460px;\n';
	html += '	overflow:none;\n';
	html += '	float:left;\n';
	html += '	padding:5px;\n';
	html += '}\n';
	

	
	
	html += '#HackThePlanetBookmarklet #autoHackAmount {\n';
	html += '	width:55px;;\n';
	html += '	color:#0f0;\n';
	html += '	background:#000;\n';
	html += '	border:1px solid #0f0;\n';
	html += '	font-size:20px;\n';
	html += '	text-align:center;\n';
	html += '}\n';

	html += '#HackThePlanetBookmarklet #numberOfHacksLabel {\n';
	html += '	font-size:14px;;;\n';
	html += '	color:#0f0;\n';
	html += '	background:#000;\n';
	html += '	border:0;\n';
	html += '	padding-top:5px;\n';
	html += '}\n';	
	
	
	
	html += '#HackThePlanetBookmarklet .button {\n';
	html += '	display:block;\n';
	html += '	padding:4px;\n';
	html += '	margin:0px;\n';
	html += '	float:left;\n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet #missionId {\n';
	html += '	width:450px;\n';
	html += '	margin:2px 5px 0 0;\n';
	html += '	padding:1px;\n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet #missionHack {\n';
	html += '	padding:5px;\n';
	html += '	margin:0 0 10px 0;\n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet .terminal {\n';
	html += '	width:300px;\n';
	html += '	height:272px;\n';
	html += '	overflow:none;\n';
	html += '	float:left;\n';
	html += '	padding:5px;\n';	
	html += '	margin:0 5px 0 0; ';	
	html += '	background:#252525;\n';	
	html += '	color:#5fba3d;\n';	
	html += '	border:solid 2px #fff;\n';
	html += '	font-family:Courier, "Courier New";\n';
	html += '	font-size:10px;\n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet .terminal textarea {\n';
	//html += '	width:300px;\n';
	//html += '	height:272px;\n';
	//html += '	background:#252525;\n';	
	//html += '	color:#5fba3d;\n';		
	//html += '	border:none;\n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet .terminal textarea.error {\n';
	html += '	color:#a82323 !important;\n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet #itemsFound {\n';
	html += '	width:0px;\n';
	html += '	height:280px;\n';
	html += '	overflow:auto;\n';
	html += '	float:left;\n';
	html += '	padding:5px;\n';
	html += '}\n';

	html += '#HackThePlanetBookmarklet .button_minMaxBookmarklet {\n';
	html += '	width:12px;\n';
	html += '	height:20px;\n';
	html += '	padding:7px;\n';
	html += '	display:block;\n';
	html += '	color:#0f0;\n';
	html += '	float:right;\n';
	html += '	cursor:pointer;\n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet .minMaxToggle {\n';
	html += '	background:#313131;\n';
	html += '	margin:0 0 5px 0;\n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet .minMaxToggle span {\n';
	html += '	display:block;\n';
	html += '	width:100px;\n';
	html += '	float:left;\n';
	html += '	font-size:10px;\n';
	html += '	padding-top:15px;\n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet .fieldSet {\n';
	html += '	height:25px;\n';
	html += '	clear:both;\n';
//	html += '	padding:5px 0;';
	html += '}\n';

	html += '#HackThePlanetBookmarklet .fieldSetFloat {\n';
	html += '	width:70px;\n';
	html += '	float:left;\n';
	html += '	clear:none;\n';
	html += '	height:65px;\n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet .fieldSet #autoHackStatus {\n';
	html += '	padding:0 5px;\n';
	html += '	font-family:Courier, "Courier New";\n';
	html += '	font-size:14px;\n';
	html += '	float:right;\n';
	html += '	width:230px;\n';
	html += '	height:20px;\n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet .powerButton:hover {\n';
	//html += '	opacity:0.4;filter:alpha(opacity=40); \n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet .powerButtonActive {\n';
	html += '	background-position:49px 0px;\n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet #autoHack {\n';
	html += '	display:none;\n';
	html += '}\n';
	
		
	html += '#HackThePlanetBookmarklet .powerButton {\n';
	html += '	width:55px;\n';
	html += '	height:55px;\n';
	html += '	float:left;\n';
	html += '	cursor:pointer;\n';
	html += '	display:block;\n';
	html += '	background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAA3CAYAAAD6+O8NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAIRpJREFUeNrsfHmcVNWd7+/eWruru6v3ld6QBuzGVkCEYUxQwBWdURJ1JGPGvKdxkplEJ4sjyYxLdNwQjYnjEn36XBKJMdEoZmTUiIIIsuPCvnQ3vdH0Vr3UXvd9f+ee030oqpulSSZ/vOJzuFW3bp37+53v97edc24T/f/XX9TLONUdbt261cTBlH2LI14Wjgk0cayvr0/8pQ8M9FDym/KUA3rwMS4/J/A5ccYZZ1in8r7OsXawZcsWQ/bjhICO733ve4UHDx7MCofDzv7+fl80GnXjFfL5fMG0tLRIdXV176efftrJiuH66JQpU2J/KSBAFx58F+RyPv/88761a9dmNTc35/B3PT092XzMzs7u4eO4ceO6Z82aFYAuA7iedWBdEv9jFqKEf/PNNzOeffbZqkOHDhUHg0FfIpEI43wQLSLZlJAsY9DcaGmmabrT09P7y8vLmxcvXtw4ffr0Qb6+rq7O+h8CwsW63HbbbYUbNmyo6O3tzQORWN4BNNYnqlmGg69F86D5XC5XDCB1nn322Y0PPfTQIb4WekT/rIBAAQ8D8eijj55x+PDhQpzqla1PAyOmuSll/i4JihctiwnncDj8RUVFjQ888MB2ADNQW1sb+TMCwYPu+va3v122cePGM2DVLGeX1IXBCGlgKPabGiishw/Nj5br9XqtGTNmbHvqqada+HfQJfanVsD93HPP5ZSWls4Cy6/CqbloZ6BVoOVLwVjANCmsR2teTQEGowCtEu1MtPkAZuH48eOnr1ixwr99+3bXnwEMzyWXXFIJV3opPv4t2iy0GrRiNHZTGZoe7qTmld/xNdnyNzWyj7/JyMi45LLLLquEHh4040+mwMKFC8fBRK/Gx4vlQJZJgdI1ANzaUTVXiuaRSrHy49Cmol0Kll15yy23FO3YscP9J9LDgeYFqWbiI5Pqr9EmSIJkSD1cKi5KaxitKUvJkKQ8TfZ5VUlJybnQIw3NecoUeOD+BwUYyIxOh1V8Vd6smk00CQgPblwfCATuGhwcfB9ty8DAQDeOFo67+TNizG/hn69HsCzSFHZLYHKlMl8G6F8577zzxqM/z9333HNKY8Urr7yS7ff7L8THBWj1kt0ZScRxau9HIpQOmK4L98X6TWGCwQL/Fq49d+fOna5TpYS3srLyHLz9Ctp0tBK0TOWCMHAZnZ2d/4QB34/BthBTrPb2dqulpcVChmIh47IaG5uspqYm8Z6/Q8bCIL3Z2to6I4UypWh8/qsIjvVQxHOqwOAM0OPxsB7z0SZK6/QmgSCsGrLNgYwPQq+NOG6VxLKQOR7CcQs+v9HX1/e/Nm3aVJpkSU7ZZ7a0vHmw+oWIkXm7du1yjSmoIxf3XHHFFVP2799fhY970FplsOMgZ2DQLwLbHgiFQhOj0RhZVoLi8ThaghKJOMViMRwT4mhZFhoiomkQ4gXBCigzM5OQbS1D/7cin2+V8jhljGF3OH7q1Kmf/frXv94/ceLE8BhqCsfmzZuzbrrpprkI3N04tR+tU2ZQQ8H6O9/5jufuu+/+R6Tp349EIoXItIQ+rAPLbx/lwEFS1gEAE65fAYD+raCgYItMYlQ2xmTKY48CUHIRf/+IbCxQU1MTP2FAoIT7m9/8ZtW6devOwsfdaAfRBiUYZldX17/Chd0OMISgdrOEPPzeBsZuDAg3VpCPXGA5nU5WhAGh3Ny85kgkfCV87mZ5e5cEpQLgnXb55ZevWbJkSRsUiZwkIGmzZ88+D8zmjGkfWocGhij+kLZ/FbI8EAyGSuNxm0CKXPxZAaPIZYPC5HICGKcgF+qsZW1tbT+EnG0SGFNaC4MyAcHeBWKsxPfBkWQ1R6q2X375Zf/69eun4WMjWpsEI4HU1APX9BKEux0xYWiQbQsYBmIIJMEsa4hl3MA+gulzsUUAllpamstw/kO8v1yKwAMXQGtGXwffeuutcxBP0vfs2WOcBBicTdUDDLa8JrTDEgweMOf111+fHujrexJsfxEylYIYQwRiuVknJbfSiXWGRRDGgbq7u4QOcHEEMP4uNzd3E/SaI8mekKkzp9KN6N95/vnn10MPzwkBwj70ySefPAs3PyzdVL/s3PH222/fGwqFr4TpEwOS7JaUO2L2szl7cGQG8XlYlGCVUo77YGCQCECZdi+U/FVDQ8OZUoaYAgUD0A93U4ffuk8QDCZWFgaqUlq4sgzhUhYtWpT285///DehYPAf2NKHXZSy8tgR5BoGxhqRXIibBdBjOcC6TIJiSVD43k0AruLFF1/M2rt3r3lcgEAJ5+23316AG/glGH2yU8eBAwe+DiG+HQ6HhBAMQiRiWwgPNrshPooJKwkSK6n7YnFTc/i2/B33NTg4wAp5AeIbq1evLpL3jMgirQXJQMkzzzzj37dvn3ncVa9huJ5++ul63JcH45AcGOVKnI899tjPMHjzeVAVuZSLFYgJdzRMLj6yjg5nanIhyAurAQG8eP8SYmy9mveS9z6E/jsef/zxKSzbcQGCLMn93nvvMUvb0bql+6Bly5aVw08uUazmIM7vOXgz+1mwIfcFAVnYzzZvplefe5aiUFh9z8qz0soHK3CUq2O3AR/7qMYu9reH8V0nAJmCTO24rGTbtm2OO++8swAZYJZ0uf36NA6YfAvk+XtbnwFJLls2h8OUFm0MxZIjyCWBs8nlkKIa4hp2ZQwu7utDH29KcimLZxnaOjo6chYvXlwAcjlGBeShhx5y3HfffcUYFK/0tYPKvOfOnfsT3CydwWDBo1FbeB5UFpIV011WKDhI93/vu7Rr+Wu09Y3fccAT54VkSiEZ3JGrk9drf8+/R39fQcz4K41dLAf06Ch48803/TfffPPxWIkLxKqT/nuIWNLtTkTWc7tiNctjkytxNLks26I/WvMBvfjLXxB7B9Z5GMCY4A1nXTq5uC/0XTphwoS7NXJFpCyHV6xYUZvKSnTFjClTpnAWMF6mhAHlqp5++pkK3GQh+1kERyEIN+VymBEq81C+tj/QRwVuF325rIhOT7NNnQXl71hwvs6EFunpPsrKyqLsbD9ASx8CDQP2Yymf7rq6ERPGX3nlla7RMkRYh/HOO++kw334pS66q3IgMfkP6OFiMGyrtcFITS4n9fR2008f+wntavyQNn/+rnBfR5GLhsnl8Xh1cn0dNVBtkuvqwr2zN2zYkDYSIEI5pH2u7u7uXKm8SjHNCy+84OsAw2QwWNiIdEGxWJxU2suCbVy7lp544D7au2O7MPdsAFKankb5abaAbQ0HaMNHqykBBTjd5VQxKyuTUMsQUkKcS7N9NBRBn/OXL19eomUrbCXdcAWFuNZ5jNjhhJ+ulC6iT7eOP/zhD7WQ9QKWm4lkW3t0yCr4nHopcvUgk8ov8tG0WeVUVu1NTS7TEDolk4uXJHJycu6RY51Q5MLv+370ox9VIS67kgERYCxdutREUVSAzmN68ZeXn+/BTS/jAdezKithCWYpv7t7+3Z69LYfUuv779Anv/hPygLzM8Eugy0HLQSlXr7z3+iT55+h9b96gYqKiqiwsFAowO6MWcfKqTgD4M3y8vLLNEvgQe2DDB6wP+2WW24xRrESB4BTxArqM86o/q8DGA4mF7LFlORiGdZ8vIqWPnIP7dz1hQjimX4P5eb7yJ9tD/Te/Tto9Zr38buoRq6slOTC+Fz0yiuv5EnZ4tJKAojXuQxYSpc1fvx4x86dO/Mlq1Rq6FywYAGfm8TCs3UoE41I0+b3fHzu4YeoJt1LF5QV00Vz55EXQmehWfGEHeQx4ONyc2lOSSHVHWqivp3bebFHKMd9Kndop8F9qu+LZcWrzJ3lGkDlXnjBBRc4RipuWUn05ZfEUtZhggAeDNIFPOB8P/b/ygp0cm3avJ6W/uzfqeHQJ/TBJ7+iLD9iXLqTYuBqwopTT6CNnl/2IK3Z9Fv68JNXqbi4WJArM3NEcrkmTZp0eRK5oGp/1oiAAGWTL5BKq3l8Y/68eZPQsaEKJpWTMzNU5vH5li0Uamqgafk5VF9bS2ULr6FgCO4ArGMwGBTD6aJLb/4+eQ2TKsCoyMp3hLDsx8Fmzu7EkVsg0CuyFXxfX1FR4dYAYXMP4loQMnPEwI7Y4YBcjqSpEccNN9xQCtlrGOwjyAU5bIDiwgs8/exPqWpiDs34UgXNmzcf8cwtAIlCH24et4/GVRRR/YwyyinvokPdewS53O4jydXX1y/04/5BhC9rMZHHN8QyorxIDQiYauKHaVKJodUxVJ7jVdqniiGVSaiUcOfWLVTuS6dqtOwrrqZesLwTxV43rIrBABxUUFBAZ0G57sJS6hgIkqdhL3V3dAggkLdzCiUKK7v67VaA5MP/ujTXynJFMGiZkNdINQX02WefmQ8//HCWVDqqfW/Onj17smTsUCWu4h/rweTasHEtftRLE2rz6cz6mTRl/CU0CJBCIRAQFsXN6fDS33/1B+gxQblFaXTg8AcpydXV1SkKRk6rcc+a2ro6FS8UKDFktVlNTU3mUWvq6MyEYE7NOsQcD85V2XM2DlEYqcJOFXl8DPX2UDHM1I9CyiwrF+wIok6Zseg6ire1EM2eQ7t27RID3efPpQPNTVTgclMUcSUMwFQg5fsooGVlz+vxDi1tTNhciLvwvZFiXs7iPmDprqQVS6ELMqBSAYC8h00ux1BNwccduz6jghIf5RWn0YTi+WJAe3sGqLd7ENbBwd9J+fn5BKLSH/74EnW0B8ife4C6ezqpu6tXgEJaYcz3YBfG6y15ubkuaeWWJFcM17tSbXIwwEgTApnJAT8QCHg5OHHgYiBURa4yDB6A7Cw/pXOKiNu4cJ4DGw9yxfQZdOaZZ9oCgTF8fWCgX1hOBIBloPbwQGiOIzyJx5mKUkallGCeQzN18TUTB5Y0kssyALxbgpHQwOLdL+lC6VHINRjuo6xcDzm9BqW58gFEP25o0IVzrkN8CFBJxixCrBXkCve7qeVgC/mynTQY6iU1nZRMLh4v1G0IL2l6dijkA+C8qcI4ykLYVci82dBSNM5WYjxgDAgroQDRb1o9eTK1rFsj3re9/x6Fp59De/fuFX61p6cXgNi/S/N6aR/iTUUaFEYW5ispoQG4KtQcR7BUKziZEJbmkgTTIWcc31ma5Wjx3GACxLQtPOoagzdgsOwceFORi6u73Jwc6o434AdxMp0JgssUA31axRlUX18vyHXYOCzGqh8xwnSwO4tAt0wKue3B5wlVU46xskS0KIh0lC5S1qPTXlYQQiXk1LdKKQ0UL3tZSZfLLZgsc2uZKtrVau0551Avgl0wEqO+135Lnbt3D1XfHNw5yPFvnrjvXvLBnRUDoKxZs3lkh6bgOVXkgWJwWGm+HmBEEFcS2uA65HajKJg1UsprwUJj8lpT0wWkC3Tx/Vg2TlFVY4vmow9yTKqpE/NzYcSTT/esFPGNycUDze6Lmz2/5aLte7biLnBJ7mzKysgRBaHQQc57ud1ubbyoq7u7R7dYoQ8Aj8l9a0cWhowefhyUK2Zq9cvcs2dPAwsl1ggS1tB8DqfBHHg5XljInEovvJjaYK6eBIB56jFqXflH6mjYT+2NjfTJBytp8T9cR22rPqSzc/xUmZdLeVddKyfwHAIEbipldLttQBoaGrpguQldAV70AYBB+N5EqrS3trY2ce211wa0pdYhd/fxx2u+sMnlGpFcU2qnU3+AJzzDtHHv69TYuksQhsllp/52IfngI3eTMy0Gd+Wi8cUzhYWxJ0gmF4NieyRr+8GDTRFt3IV8X/va1/rKysoSR7kssDHBe6UwAGp5VsxjIRjv+/TTT61zzz3X0Nc67EIxJOZ2BgYGaSJqj31trdSF9Hcc2GN9tIq2v/1f1AzriOD68VC+pjCfJufm0YTb/p1MuLM4wJQuxnZVcmFLTcts3rz50yTXI3Z8gFU8r5VI4bIEQFVVVVEebAycR/u9heKs/aabbjqA76pUZW57h5hI4/m+JsqCqZMupPaO1eSuMOj97T+nAnMmVZWcQZk+Px1o3Ee/f2sZBROHaEJ9LhWV5tPZE79Ciag1RC41Ayz6kzEKY7ROk1kQC3JY55xzTiQ5qAuT3rJlS6KkpKSrtbW1WC49cjVpIngNvv/++wfww2o1zazSRE4Hw3IKgs9X/d0i6l63loyPV1N5mpcKwZh+uLI4BPRCsMKaGir+7r+Qe/xp4noeELVOIhIEXhjCZ+6/ubmZduzYsUoDwyE3VWTMnDmzE4M74i7BvLy8mCRXumSimAFEnyFY1iq4pyquzFVhqGoHu34YpBn18+i99a0U6GmgrDwXwFlDW1f/N9J01CrRBPmKXFQ1Lp/GVefTVXPuILcjHcnAoLQSzxGrpQwKSBfftm3bCm3GgGWC5/Txrsd4yq2kr732WuKuu+46vHXrVh868kkLEWBt2rTpj2Dr/z799NPFQLLp8mwvK8IuiweWc3pELcpHrZF16aVsWpTe1Mg74cjNUwlTp1HmWVOHlGcQ7alue3bVMMyhaQs+DxIk2tvbP9DW2cUmCLCKVy0Hnn32WSvJZVlaZI/zbkIAkiPJJVYI0Xdi7bp1vz7/vPOuU1X0SOQ6/+xFtK/9EzrY/wFAQZaJTDIc9BEnZC6PSRMrz6QFM79P2eklQ/N7R5BLzghLF//Rj3/8o2bNXYmNgkidO7Wa7+i9vWBQFMzq4ZlIOdsrzKmlpWXFiy++eD0Ac9izoSENFJsJTrgIFoRz/KjpoIyzZ1D6l+cIH8qCsoCco7NbikaiYh3FnjE1xNQ1f2alOC4hbnGBtxaxq0OLHcx2xF9/1759++KpgNCWEeILFy5seOSRR6rkTpYBVZf84003bQG5PgIJ/tomV2hoql0nVwxurH78XJqduYA6B/dT92AjxY0QFeVUUXXxVCrMrhK6M4DsuvV1IZV9SnLFIe+9Wgrukrt2/Igfm+W+4OFJONlE0JQbDzyoNMfpGxowSEH8sAbBqqq6uloowVMprJDafcHC8O+5qalpoZj0zUMtHFYzA/bqomWDwX1xBsP5/csvv8wB/T/A8ANywF1y31bFrFmzPkNc6+FtRqnA4BcsmkFJwK2Nwz0NSa6YWk4466yz9sM9X8Uz2Mpa1dQJA2PrYOvidLgo3z+OqorPpNOKz6binBq4KB/Z0y+hoTkxvpatnMeD++HzXErABa647rrrfibvb8idm2U89fPCCy/shBzREaff161bx9vrm+AHTW3PkgiccB//B1YS+eKLLyQTSA6oHczUEqecOqdhSwpJACPDS70yuxn232EA0SMUePXVV6mxsfFjALJey0bYOgqgRH9lZWUXUnHrWDtoioqKIlOnTt0hdxNmadlW/Fvf+tZG3OsJxWR9gcpepnUM6caNvxue+AyIxp/ZmoV3EGAYQ5s8+HrWBUB3rl696jbNLTnldtuCGTNm7NCmdlIvUEm3FYPSO+XuO79KHSFEM1zO/33sscfEvBOneHaePbyiyoIxME6na8hNGdKn6hZkaevtoRAvdx4W8z5vv/02IaPrO3jw4FIt1fVI68hH1f85Ylw0BQhH1SQ1NTWx+++/vwVWHZTbRNO0+bDE/PnzlwCAd4+HXColVuRSLk6tjipycbbG34spor7+2J49e29YsmRJo7Z0zNZRiPg2+Mtf/rIZ1hE71pq6sWbNmlhpaWkr8uiYtt9VKIwM7HW4lVX33nuvmD6wF//tDQAsnKpM1XImn3PIoyyOhqakuTHTYHl06NAhgnuhDz/8MAp3eT/u0aaluexvS6BEL7KSHrijhF7sjbZyeODAgchFF130uSRXniSXmthLLF68+J/dHs9mLvJUIZdMLuWO1fq/0kudTySRi8kK+WPQ6wc33/zdVWpdSRKLx7N4wYIFn3Nxm3IhR6tohxqEceTn50c6OzsnW2yHtmmJbAdmuxm5dg0CYwkPfmVllZiDYkHV1IqdZdj+VN+ZodwDs4hndjs7uxArDtBLL73E1XAMzPopLHSVZuLsMovRXz5MfMP27dv7cH81YThiDFGv3/3ud4knn3wy8tZbb+XCveTJxSq1J4tgiTG4v99ffPHFlZBzEsvNA227LIdNqKSm9NOnebipmV4ce/bv338j3OLrctws6arEDka40h5ktLuKi4ujI+1cdGlgqD2qvKCSCT9Yg0xnoty1EZDXuCGQFx0vQkb2N7xSBsRp2rRpQwF9aLuMZJYSXi0MsY9l4VeuXMnbjhisHljGUrBrk8zsovJe7KqKJ06cuBn9NSJ+Dappa23ycDSALABtAEj/Nddc8yX4/aDcRtqnbwfiIwLs9Sg4fxCPJ7J0i+GtQGoXivICChBV/DEYYoY7GFy7fv36f3n44Yf3Sj2Uq+J4XI2x8r377rurEBICAMQ6FiD6ZmGx6RgVbyZYexaAKZL7mvq1usCFAuxLuMk1EDSPK1SefKurqxOrZzyxqNZO+MVAsIuCG+E4QU1NTWrKYgtA/wWY36KtxTjUcxd47UEhtwOZVb/2IFBce4hmVED4vzfeeMOFNNp/xx13zAEpOuUORh0Uofu8efOyb7zxxu/CXV8LIvk4FjI4ar+ZijPJ5ML7z6DPA7feeuu7SYRxyISiCkTNX7p06cqrr766FzrFRtvbOyIg7PeAph/MncVbgOQODrXe7rSnohzpcG/zocSlEDhTBW+1f5dnS3nBRsUXteIIpfYA7Jfhuj5PekpJZSKFqDkOAtxtu3fv7tMeLYueKCD8WrFihfuZZ54pev3118/FALLFN0urj2szAcJ9jxtX7v7hrT+8sCA//wLowDtGyiCzT5vhboIltQ4M9K/esmXL79Hv3pi9uy6myeWSepQDjOJFixatfvDBBw/Bs0SPtfvdnSSQ/lyEG4E0DQzNgFnW8SY2uc+pT7JVn/RzYABPhxubAgFqAY6Pff/wBo6EYCUYtRUWtxEAd2gKqIFzSyVgfHl7kSHtRvobkGBENAuJnSgg/IKL9ACQnKeeemom3Av32SL3SenuRcVRE0TjeTMX12aIKVDHMFBbxWPxWHRwYCB6uLMz2NvTE06SxdAywzKMRTbqkI/uu+++w48//kTkrrvupDEBoh7GwQBxtlMJRk8C09l99Mj5rriWsVlaoZlcSVtJA5jQBkFV4vzMYVpBQQFPKrbClSnLOCWA8Gv58uUuuJqMG264YQayoUy5XfawdMdxbb4pVVlgaYtLpF1vaa7cJ2ufUhA0es8996yFm+rjuuh4H/oc1WVpzQ228FxSHhg+AUz3SUsZ0DZGjPZYcPKgObVnKDi1zoTb68nNzd0N9vYA+P4UYIwZEH498cQTDiQh7m984xuT4A5PgwsLSlB6ZCYWTSJScl9WUung1B7Py8cYpU+ePHkvAjjXc1GAET+Rp3CPBYgODK9xe+BK+OZ5cGPVUEZN1YeSnlq1tE1uhhbkTO0ZQ7YKH/rsg1tkP9zFriTMJb49+OEkUE46hqTSfdWqVSJjhEuZBNdYjdgwKF3YgNRJv5eVtLikzyIwoXLYupEI7V+2bNnuioqK4PFaxfEC4tKB0I7i8S+w2YPMyoMgl4tBLAAwmRhQd9Jz3bpfNbXH13gtIITWhz5a4QIDSBvDEXshJKpZgw5INMlCEmMEZGgMVq9e7Ub250PBW9nQ1FARGhzgQQ5ZBgVRjkR5Ndkh++IdyXjjTMQwFhZ5oZgXcXawoqK6Eb9vQBIyOGvWrJN+2iu5DnGkeODRkwTMEQ884uXEoLpQ1brAtnSAk4sBdiCIe9FMvBdLrvxnKHBtBNdEcX0HwAsCxBj8eTRu71iOy4FWoISTQIloW3t01o4EyIn9EYI7yPxkwVOuqN/l7gr0eP/zJy+UHDrclQ05zb5AMCMWtTeAOF2OhC/L2+92uhLFpXk9ty7+eqvXnx1qDQQiV0y7OcJ18FiehTS0NfRjAeJO8aSqQ/udgQE3wXrxnvd58ZFTk4R81o3XI+SRZ6V1C4przE+2kEgSIMl1iDVmQCwykPsYc6QVB7uQXZqV3oiZ6XYZlsNFSBgtu8IN4ZZOczAeEVtVglF/1oEgsoJoCdp0SZKxgKIyAzOF23JrbivZZbmSnjw1kzYUpJpnslK0hDa4cS1GJAMS0SxntPhxUoDw9NtK6AEFXbghb1ryDfKfzcB7Xl3ATRym1AXvLQdvRYIMOBdO2ElAP4QL5kHG5Th/p0En/TdPnKMMWHJ6mqrpACTgisoNw0znzcn2spM9vWCYBn8W92Brwb+2SDgciPNmrJHvER8lTlijAHFSxCwEoVCUuDEgGUA951c/obkw7jx3uimeyLNX0sTecZ7dS8RQoAcHKVw3y7lh1iXGTg+FEvsgZy3LaolrrbEAou9xskYYpLg2rRFP3mLj92dfme7LuJHnfnh63c0806YZ1NYegMHrHyG3y/xGZ2dnAAViPAmAeAowkkEZKa0+4Rdbx2+gwzjbQty4ccYtc40lXW3WRVl5iNo+Xu+wtTTs68UybgyohWFGq3+fCJdVlF9cUReLFVCLKJYtOvm/6uMcBYxULiWugRHXATEdzrIMX4Z4LoIjBk9FZ2VmiV3ybpeLAn0BsUWGX9nZpjfN68yHtfQDkJHuET9GrDilfzkIvtiAu3K4RQZlFPnzLRo3AUTL50DOwXA4d2d/FYaj6u9FjtxueQ7vLaiqq3M2N1OLWTjGv0Fmpih+kv178oDFUg2a2+Vs4Q1mBvJE3nhWUFAoOuFJR16kKikpFQs4DBiACRcWFgziaDmdzsQx+h4tvT1l1hKxY0Mcx5g7zWznCV1Ec9Gc7uHmcg2fhzMgT5o5OG3G5C5e6jAolyvlMRElOYYYKdyVbhHqffJspQWL+E1efv42n8+bmZ7mdnInvnQPLCQi3FUC4aK0tNDizXaZmRntAwP9PSgAIzFedD8SjNgJgjG2NNNerrG+wP0QQyIYkP5HV+Tc9saT7ncKCvxZ6VlIdE2Lnzziaw370XUkjjEjGgk5wxMmlu8rKslpGaC+gT7qijIgYzERQ3sgxkhaqNL/qEqqP8Ti1OsRXtRCtc1T8i65Yz0lc+W2Sf67IZGOjo5wf39/JCnDStVix6g9rLFYiJ5lpYH0YUrLcFCZ30HZPgNeDDHcYchxtuQzYTgfd5I3bFAmnJfVM0gdfU5aFxxrlmWkSFfNVAtWNPJfw9HrETFLym2EPVND7hCWEeem1RYxbfAjSZ/jowBCYwUkuQ6BclxEoflccLK86m4oQIJiGdOwIjAWJF/xTPJE2ygcyaX2yPQh+SzrVAAykpWkshTnSIAkZ18pEoZU8Ukf/NgIlnG8wf3kBsOys6Pf8G5NtHMh9yEZYz1JgfqgvThusWkgiIt0Fy7PumOMYPDr/wkwANeS/6uoiMeEAAAAAElFTkSuQmCC);\n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet .fieldSet #autoHackCountStatus {\n';
	html += '	padding:0 5px;\n';
	html += '	font-family:Courier, "Courier New";\n';
	html += '	font-size:14px;\n';
	html += '	float:right;\n';
	html += '	width:230px;\n';
	html += '	height:20px;\n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet .fieldSet label {\n';
	html += '	width:130px;\n';
	html += '	float:left;\n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet .fieldSet input {\n';
	html += '	float:left;\n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet .fieldSet select {\n';
	html += '	float:left;\n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet .infoPanelBox {';
	//html += '	border:solid 1px #fff;';
	//html += '	width:245px;';
	html += '	padding:5px;';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet .infoPanelBox .cellLogo {\n';
	html += '	width:100px;\n';
	html += '	height:100px;\n';
	html += '	float:left;\n';
	html += '	border:solid 1px #ccc;\n';
	html += '	background:url(/images/cell/100-black-flippers-diving-kids-shirts_design2011082023.png) center center no-repeat;\n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet .infoPanelBox .infoPanel {\n';
	//html += '	width:330px;\n';
	html += '	float:left;\n';
	html += '	padding:5px;\n';
	html += '}\n';
	
	// New - Terminal

			
	html += '	.cursor {\n';
	html += '		font-size: 12px;\n';
	html += '		background-color: #5fba3d;\n';
	html += '		color: #5fba3d;\n';
	html += '		position: relative;\n';
	html += '		opacity: 0.5;\n';
	html += '		width:10px;\n';
	//html += '		float:left;\n';
	html += '	};\n';
			
	html += '#HackThePlanetBookmarklet #responceDump {\n';
	html += '		margin: 8px;\n';
	html += '		cursor: text;\n';
	html += '		height: 500px;\n';
	html += '		font-family:Courier, "Courier New";\n';
	html += '		font-size:10px;\n';
	html += '	}\n';
			
	html += '	#writer {';
	html += '		font-family: cursor, courier;\n';
	html += '		font-weight: bold;\n';
	html += '		float:left;\n';
	html += '	}\n';
	
	html += '	#getter {\n';
	html += '		margin: 5px;\n';
	html += '	}\n';
			
			
	html += '#HackThePlanetBookmarklet .autoHackShowHide {\n';
	html += ' 	display:none;\n';
	html += '}\n';
	
	html += '#HackThePlanetBookmarklet h1 {\n';
	html += "	float:left;";
	html += "	clear:none;";
	html += "	font-size:20px;";
	html += "	color:#0f0;";
	html += "	padding:5px;";
	html += "	margin:0;";
	html += '}\n';
	
	html += '</style>\n';
	
	html += '<div id="HackThePlanetBookmarklet">';
	html += '	<div class="minMaxToggle">';
	html += '		<div class="button_minMaxBookmarklet">&plusmn;</div>';
	html += '		<h1>Flippers Cell Tools</h1>';
	html += '		<span> v1.5</span>';

	html += '	<div style="clear:both"></div>';
	html += '	</div>';

	html += '	<div class="toolBelt">';
	//html += '		<h2>Mission Hack</h2>';
	html += '		<a href="#" class="button" id="refreshDashboard" >Refresh Dashboard</a>';
	html += '		<form name="missionHack" id="missionHack">';
	html += '			<div class="fieldSet">';
	html += '				<label>Mission</label>';
	html += '				<select name="id" id="missionId"  size="5">';
	html += '					<optgroup label="A shadow from the past">';
	html += '						<option value="11">Get through Ner0\' firewall (Possible Task Rewards)</option>';
	html += '						<option value="12">Acquire admin privileges to the IRC server (Possible Task Rewards - Required 56K PSTN modem)</option>';
	html += '						<option value="13">Set up a new admin account and delete Ner0 (Possible Task Rewards)</option>';
	html += '					</option>';
	html += '					<optgroup label="Old Habits are hard to break">';
	html += '						<option value="14">Hack the Police evidence database (Possible Task Rewards)</option>';
	html += '						<option value="15">Find out where your computer is stored (Possible Task Rewards)</option>';
	html += '						<option value="16">Change status of invertory to "ready for release" (Possible Task Rewards)</option>';
	html += '					</option>';
	html += '					<optgroup label="Getting My Hardware">';
	html += '						<option value="224">Use Ner0s comptuer to set up a proxy (Possible Task Rewards)</option>';
	html += '						<option value="225">Hack back in to the local police station (Possible Task Rewards)</option>';
	html += '						<option value="226">Check their servers for any reference regarding your hard drives (Possible Task Rewards - Required PIII 733)</option>';
	html += '						<option value="227">Upload all the content to one of Ner0s servers (Possible Task Rewards)</option>';
	html += '					</option>';
	html += '					<optgroup label="Uncomplete">';
	html += '						<option value="228">Write Ner0 a Virus (Possible Task Rewards)</option>';
	html += '						<option value="113">Upload it to Ner0 (Possible Task Rewards)</option>';
	html += '					</option>';
	html += '					<optgroup label="Dreaming">';
	html += '						<option value="68">Hack in to the palace, you need to save the queen (Possible Task Rewards)</option>';
	html += '						<option value="115">Scan the kingdom using your sperior mind to find all the castles (Possible Task Rewards)</option>';
	html += '						<option value="120">Viruses looking like little turtles everywhere. Destroty them (Possible Task Rewards)</option>';
	html += '						<option value="101">Hack the gates to the main castle(Possible Task Rewards)</option>';
	html += '						<option value="108">Use your mind to manifest two small Italian guys to battle the mutant turtle (Possible Task Rewards)</option>';
	html += '					</option>';
	html += '					<optgroup label="Greetubg An Old Friend">';
	html += '						<option value="83" >Hack in to Spalding [30 35 30 20 100] (Possible Task Rewards)</option>';
	html += '						<option value="119" >Acquire Admin privilgeges [3 2 3 4 24 ] [30 35 30 20 100] (Possible Task Rewards)</option>';
	html += '						<option value="77" >Delete all his porn [32 32 30 20 100] (Possible Task Rewards)</option>';
	html += '						<option value="86" >Run script chaning all the file names to "No_jail_can_hold_me" [36 28 35 20 100] (Possible Task Rewards)</option>';
	html += '					</option>';
	html += '					<optgroup label="The Captin is here">';
	html += '						<option value="229" >Set up a proxy [55 50 30 25 150]  (Possible Task Rewards - Required Generic 512 kbps xDSL)</option>';
	html += '						<option value="231" >By pass firewalls [80 80 30 15 200] </option>';
	html += '						<option value="230" >hack into bulk shipping [38 36 32 20 110] </option>';
	html += '						<option value="232" >download the sips logs, what they are carring and what destional [55 60 40 20 160]</option>';
	html += '					</option>';
	
	html += '					<optgroup label="Spaldin Assists">';
	html += '						<option value="168" >Set up a proxy [55 50 30 25 150] </option>';
	html += '						<option value="172" >By pass firewalls  and any other security measures  [55 60 25 30 150] </option>';
	html += '						<option value="174" >Find the full inventory list and all information on ongoing hauls [55 60 35 30 160] </option>';
	html += '						<option value="176" >Download everything you find, encrypt it and sent it to Spaling [55 60 40 20 160]</option>';
	html += '					</option>';
	//
	html += '					<optgroup label="Eyes in the Skies">';
	html += '						<option value="100" >Setup a proxy so not to be detected  [55 50 30 25 150]</option>';
	html += '						<option value="121" >Bypass Albatross  [ 55 60 30 25 170] </option>';
	html += '						<option value="107" >Find the files and informaion you are looking for id  [ 55 60 35 30 160 ]</option>';
	html += '						<option value="233" >Encrypt the informaon and sent it off to Spalding id  [ 62 60 30 25 170]</option>';
	html += '					</option>';
	
	html += '					<optgroup label="What is Spalding Up to?">';
	html += '						<option value="234" >Setup a proxy  [ 60 60 30 45 170]</option>';
	html += '						<option value="235" >Break throught any firewall or other security measured you may encounter  [ 50 70 25 20 145]</option>';
	html += '						<option value="236" >Find the companies client list  [55 60 35 30 160 ]</option>';
	html += '						<option value="237" selected="selected">++Encrypt the information and send it off to Spalding  [62 60 30 25 170]</option>';
	html += '					</option>';
	
	html += '					<optgroup label="Hacking the Hacker">';
	html += '						<option value="238" >Connect to Spalding  [75 80 25 30 200]</option>';
	html += '						<option value="239" >Reset your firewalls and block all incoming traffic   [ 80 80 30 15 200 ] XP 70</option>';
	html += '						<option value="240" >Fetch proxy adresses  [ 55 60 35 30 160] XP 40 </option>';
	html += '						<option value="241" >Create a network tunnel revealing the source IP-address  [82 80 22 30 200] xp 43</option>';
	html += '					</option>';
	
	html += '					<optgroup label="A worthy Enemy">';
	html += '						<option value="242" >Set up a proxy 242 [ 101 101 25 25 200]</option>';
	html += '						<option value="243" >Bypass any firewall and other security measures you may encounter  </option>';
	html += '						<option value="244" >Search the database for any reference to your or Spalding</option>';
	html += '						<option value="245" >Download all the information you can  </option>';
	html += '						<option value="246" >Break the encryption to access the files  </option>';
	html += '					</option>';
	
	html += '					<optgroup label="Gone Missing">';
	html += '						<option value="251" >Break Spalding</option>';
	html += '						<option value="252" >Look around to see if you can find any clues on his whereabouts  </option>';
	html += '						<option value="253" >Hack in to his mail server and look for clues/option>';
	html += '					</option>';
	
	html += '					<optgroup label="Track down Spalding">';
	html += '						<option value="254" >Set up a proxy</option>';
	html += '						<option value="255" > Bypass or disable any security measures you find </option>';
	html += '						<option value="256" >Search the servers for anything related to Spalding [110 100 35 25 220]</option>';
	html += '					</option>';
	
	html += '					<optgroup label="Supercomputer">';
	html += '						<option value="257" >Set up a proxy [101 101 25 25 200]</option>';
//	html += '						<option value="258" > Bypass or disable any security measures you find </option>';
//	html += '						<option value="260" >Search the database for any reference to Spalding.</option>';
//	html += '						<option value="259" >Try to delete all the matherial containing referances.</option>';
	html += '					</option>';
	
	html += '					<optgroup label="Back to DOS">';
	html += '						<option value="38" >++Set up a proxy [101 101 25 25 200]</option>';
	html += '						<option value="39" >++ Disable any AV or Firewall you may find [100 80 35 40 200] [ 98 110 25 25 240]</option>';
	html += '						<option value="261" >Search throug DOSWSs database for anything that looks related to your mission. [105 120 50 20 250]</option>';
	html += '					</option>';
	
	
	html += '					<optgroup label="Nemebla">';
	html += '						<option value="262" Set up a network sniffer and sniff packages to hack a random WLAN [100 90 50 50 125] [100 100 120 50 200]</option>';
	html += '						<option value="263" >++ Hack in to a computer connected to the WLAN [115 120 105 22 250]</option>';
	html += '						<option value="264" >Make a hidden encrypted folder and upload the files there [115 120 105 22 250]</option>';
	html += '						<option value="265" >Repeat the tasks on another WLAN to have a backup</option>';
	html += '					</option>';
	

	html += '					<optgroup label="== Freelance ==">';
	html += '						<optgroup label="Kraaaarkararka">';
	html += '							<option value="281">++ Play Angry Birds</option>';
	html += '						</option>';
	html += '						<optgroup label="Mano Infection">';
	html += '							<option value="41">Set up a proxy [ 6 3 4 5 28 ]</option>';
	html += '							<option value="42">Disable and AV or Firewall you may find [ 6 5 5 5 32]</option>';
	html += '							<option value="43">Upload the virus [ 10 10 10 100 ]</option>';
	html += '						</option>';
	html += '					</option>';
	html += '				</select>';

	html += '			</div>';
	html += '			<div style="clear:both"></div>';
	
	
	
	html += '			<label>Auto Hacking</label>';
	html += '			<div style="clear:both"></div>';
	html += '			<div class="fieldSet fieldSetFloat">';
	//html += '				<label>Auto Hack</label>';
	html += '				<div class="powerButton"></div>';
	html += '				<input type="checkbox" name="autoHack" id="autoHack"/>';
	html += '			</div>';
	

	
	html += '			<div style="width:70px;height:65px;float:left">';
	html += '			<div class="fieldSet fieldSetFloat autoHackShowHide">';
	html += '				<div id="numberOfHacksLabel">Attempts</div><input type="text" value="100" name="autoHackAmount" id="autoHackAmount"/>';
	//html += '				<label>Number of Hacks</label>';
	//html += '				<select name="autoHackAmount" id="autoHackAmount">';
	//html += '					<option value="2">2</option>';
	//html += '					<option value="3">3</option>';
	//html += '					<option value="4">4</option>';
	//html += '					<option value="5">5</option>';
	//html += '					<option value="10">10</option>';
	//html += '					<option value="20">20</option>';
	//html += '					<option value="30">30</option>';
	//html += '					<option value="40">40</option>';
	//html += '					<option value="50">50</option>';
	//html += '					<option value="100">100</option>';
	//html += '				</select>';

	html += '			</div>';
	html += '			</div>';
	
	html += '		<div class="infoPanelBox">';
//	html += '			<div class="cellLogo">';
//	html += '				<img src="/images/cell/100-black-flippers-diving-kids-shirts_design2011082023.png"/>';
//	html += '			</div>';
	html += '			<div class="infoPanel">';
	html += '				<span id="autoHackCountStatus"></span>';
	html += '				<span id="autoHackStatus"></span>';
	html += '			</div>';
	html += '			<div style="clear:both"></div>';
	html += '		</div>';
		html += '				<input type="submit" class="button" value="Start Hacking"/>';
	html += '			<div style="clear:both"></div>';
	html += '		</form>';
	//html += '		<div style="clear:both"></div>';

		
	//html += '		<div style="clear:both"></div>';
	//html += '		<a href="#" class="button" id="getMissions" >Get Missions</a>';


	html += '	</div>';
//	html += '		<div style="clear:both"></div>';

	
	html += '	<div class="terminal" >';
	//html += '		<textarea id="setter" name="setter"></textarea>';
	html += '		<div id="responceDump">';
	html += '			<span id="writer"></span><b class="cursor" id="cursor">B</b>';
	html += '		</div>';
	html += '	</div>';
	
	//html += '	<div class="terminal">';
	//html += '		<textarea id="responceDump"></textarea>';
	//html += '	</div>';
	
	html += '	<div id="itemsFound"><h2>Items Found On Missions</h2></div>';
	html += '	<div style="clear:both"></div>';
	html += '</div>';

	$('body').append(html);


	$('.terminal').click(function (e) { 
		$('#responceDump').focus();
	});
	
	$('#refreshDashboard').click(function (e) { 
		e.preventDefault();
		refreshDashboard();
	});
	
	$('#responceDump').keypress(function(e){ 
		writeit($(this),e);
	});
	$('#responceDump').keydown(function(e){ 
		writeit($(this),e);
	});
	$('#responceDump').keyup(function(e){ 
		writeit($(this),e);
	});
	
	
	$('#missionHack').submit(function (e) {
		e.preventDefault();
		var missionId = $('#missionHack #missionId').val();
		if (!missionId) {
			alert("No mission id is specified!\nPlease enter one, you n00b!");
		} else {
			if (!runningHack) { 
				useAttackPointsAutoHack = $('#autoHackAmount').val();
				//console.log('useAttackPointsAutoHack - ' + useAttackPointsAutoHack);
				htpBookMarkletRun_mission(missionId);
			} else {
				alert("Already running a hack you n00b!");
			}
		}
	});
	
	// Toggle for the minimise
	$(".minMaxToggle").click(function () {
		if (minMaxBookmarklet++ % 2 === 0) { 
			//console.log('1st');
			$("#HackThePlanetBookmarklet").animate({"height": "33px"}, "slow");
		} else {
			$("#HackThePlanetBookmarklet").animate({"height": "330px"}, "slow");
			//console.log('2nd');
		}
		//console.log(minMaxBookmarklet);
	});
	
	$("#autoHack").click(function () { 
		if ($('#autoHack').is(':checked')) {
			$('.autoHackShowHide').show();
		} else  {
			$('.autoHackShowHide').hide();
		}
	});
	
	$(".powerButton").click(function () { 
		if ($(this).hasClass('powerButtonActive')) {
			$(this).removeClass('powerButtonActive');
			//$("#autoHack").toggle(this.checked);
			$('#autoHack').attr('checked',false); // "unchecked"
			$('.autoHackShowHide').hide();
		} else  {
			$(this).addClass('powerButtonActive');
			//$("#autoHack").toggle(this.checked);
			$('#autoHack').attr('checked',true); // "checked"
			$('.autoHackShowHide').show();
		}
	});
	
	
	
	$("#getMissions").click(function (e) { 
		e.preventDefault();
		getMissions();
	});

	// Load the slider
	$('#HackThePlanetBookmarklet').css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0});
	
}

function displayOnScreen(text) { 
	text = nl2br(text);
	var cursor = '<span id="writer"></span><b class="cursor" id="cursor">B</b>';
	$('#responceDump').html(text+cursor);
}

function refreshDashboard() {
	
	// Hook into the htp js code
	htp.loadPlayerStats('player');
	
	// Native method is commented
	/*
	var url = 'http://hacktheplanet.no/eventupdates';
	var data = { type: 'player' };
	$.ajax({
		  type: 'GET',
		  url: url,
		  data: data,
		  dataType: "json"
		}).success(function(data){

			//console.log(data);
			
			var responceDump = $('#responceDump').val();
			responceDump += '*Dashboard Updated*\n';
			$('#responceDump').val(responceDump);
		});
	*/
}

function responceDumpLoading(){
	$('#responceDump').removeClass('error');
	var responceDump = '*************************************\n';
	responceDump += "           Loading...\n";
	responceDump += '*************************************\n';
	//$('#responceDump').val(responceDump);
	displayOnScreen(responceDump);
}

function htpBookMarkletRun_mission(missionId) {
	// Work out current action points
	var db_ap = $('#statusbar #db-ap').html();
	var url = 'http://hacktheplanet.no/mission_attack';
	var	data = { id: missionId };
	
	// Load the ammount of attack poings to use in the auto hack
	useAttackPointsAutoHack--;
	// If we are using auto hack then update the number we are on.

	
	// Loading screen
	responceDumpLoading();
	
	if (db_ap > 0) { 
		runningHack = true;
		$.ajax({
			type: 'POST',
			url: url,
			data: data,
			dataType: "json"
		}).success(function (data) {
			//var responceDump = $('#responceDump').val();
			var responceDump = '*************************************\n';
			//console.log(data);
			if (data.founditem) { 
				$('#itemFoundStatus').removeClass('statusRed');
				$('#itemFoundStatus').addClass('statusGreen');
			} else {
				$('#itemFoundStatus').removeClass('statusGreen');
				$('#itemFoundStatus').addClass('statusRed');
			}
			switch(data.status)
			{
				case "active":
					responceDump += "ROUND "+(parseInt(data.rounds)+1)+" COMPLETE\n";
					responceDump += '*************************************'+'\n';
					break;
				case "completed":
					//$("#responceDump").animate({"height": "272px"}, "slow");
					responceDump += '**** TASK SUCCESSFULLY COMPLETED ****'+'\n';
					responceDump += '*************************************'+'\n';
					if (data.story){
						responceDump += 'Story\n';
						responceDump += '-----\n';
						responceDump += data.story+'\n';
						responceDump += '*************************************'+'\n';
					}
					responceDump += 'DMG Dealt    : '+data.outcome.damage_delt+'\n';
					responceDump += 'DMG Received : '+data.outcome.damage_recieved+'\n';
					responceDump += 'Score        : '+data.outcome.score+'\n';
					responceDump += 'Total XP     : '+data.outcome.xp+'\n';
					responceDump += 'Credits      : '+data.outcome.cr+'\n';
					if (data.founditem) { 
						$("#HackThePlanetBookmarklet").animate({"width": "1200"}, "slow");
						$("#itemsFound").animate({"width": "400"}, "slow");
						responceDump += '++ You have aquired a item! ++\n';
					}
					responceDump += '*************************************'+'\n';
					$('#itemsFound').prepend(data.outcome.itemcard);
					break;
				case "failed":
					$('.terminal').addClass('error');
					responceDump += "--TASK FAILED--";
					responceDump += '*************************************'+'\n';
					break;
				case "error":
					$('.terminal').addClass('error');
					responceDump += data.errormsg+'\n';
					responceDump += '*************************************'+'\n';
					break;
			}
			//$('#responceDump').val(responceDump);
			//$('#responceDump').html(responceDump);
			displayOnScreen(responceDump);
			
			// Take away one of the attack points
			db_ap--;
			$('#statusbar #db-ap').html(db_ap);
			
			// Check if autoHack is enabled
			if ($('#autoHack').is(':checked')) { 
				// check to see if we have used the allocated ap
				//$('.infoPanelBox .infoPanel').html((useAttackPointsAutoHack)+' auto hacks remaining.<br/>');
				$('#autoHackCountStatus').html((useAttackPointsAutoHack)+' auto hacks remaining.<br/>');
				
				if (useAttackPointsAutoHack) { 
					// 10 second countdown	
					if (db_ap) { 
						$('#autoHackStatus').html('Auto hacking in 10');
						setTimeout("$('#autoHackStatus').html('Auto hacking in 9')",1000);
						setTimeout("$('#autoHackStatus').html('Auto hacking in 8')",2000);
						setTimeout("$('#autoHackStatus').html('Auto hacking in 7')",3000);
						setTimeout("$('#autoHackStatus').html('Auto hacking in 6')",4000);
						setTimeout("$('#autoHackStatus').html('Auto hacking in 5')",5000);
						setTimeout("$('#autoHackStatus').html('Auto hacking in 4')",6000);
						setTimeout("$('#autoHackStatus').html('Auto hacking in 3')",7000);
						setTimeout("$('#autoHackStatus').html('Auto hacking in 2')",8000);
						setTimeout("$('#autoHackStatus').html('Auto hacking in 1')",9000);
						setTimeout("$('#autoHackStatus').html('Auto hacking.....')",10000);
		
						// set the timer for the auto hack mission
						setTimeout("htpBookMarkletRun_mission("+missionId+")",10000); // 10 seconds
					} else { 
						var htpBookMarklet_timeticker = $('#tickertime').html();
						$('#autoHackStatus').html('Waiting for <img src="/images/stats/ap.png"> ('+htpBookMarklet_timeticker+')');
						setTimeout("htpBookMarkletRun_mission("+missionId+")",1800000); // 30 mins
					}
				} else { 
					$('#autoHackStatus').html('Auto hacking completed.');
				}
			} else { 
				runningHack = false;
				$('#autoHackStatus').html('Auto hacking turned off.');
				
			}
			
		});
	} else {
		runningHack = false;
		$('.terminal').addClass('error');
		var responceDump = '*************************************\n';
		responceDump += "    !! Run out of action points !!\n";
		responceDump += '*************************************'+'\n';
		responceDump += 'Oh dear you n00b, you have run out of action points.\n\nYou now have to wait for the next tick start!';
		//$('#responceDump').val(responceDump);
		//$('#responceDump').html(responceDump);
		displayOnScreen(responceDump);
	}
	
}

// Terminal emnu 
function init_terminal(){

	//cursor = $("#cursor"); /* defining the global var */
	//cursor.css("left","0px"); /* setting it's position for future use */
	setInterval("blink()", 500);
}

function nl2br(txt){ /* helper, textarea return \n not <br /> */
	return txt.replace(/\n/g, "<br />");
}

function writeit(from, e){ /* the magic starts here, this function requires the element from which the value is extracted and an event object */
	e = e || window.event; /* window.event fix for browser compatibility */
	var w = $("#writer"); /* get the place to write */
	var tw = $('#responceDump').val(); /* get the value of the textarea */
	w.innerHTML = nl2br(tw); /* convert newlines to breaks and append the returned value to the content area */
}

function moveIt(count, e){ /* function to move the "fake caret" according to the keypress movement */
	e = e || window.event; /* window.event fix again */
	var keycode = e.keyCode || e.which; /* keycode fix */
//				alert(count); /* for debugging purposes */
	if(keycode == 37 && parseInt(cursor.style.left) >= (0-((count-1)*10))){ // if the key pressed by the user is left and the position of the cursor is greater than or equal to 0 - the number of words in the textarea - 1 * 10 then ...
		cursor.style.left = parseInt(cursor.style.left) - 10 + "px"; // move the cursor to the left
	} else if(keycode == 39 && (parseInt(cursor.style.left) + 10) <= 0){ // otherwise, if the key pressed by the user if right then check if the position of the cursor + 10 is smaller than or equal to zero if it is then ...
		cursor.style.left = parseInt(cursor.style.left) + 10 + "px"; // move the "fake caret" to the right
	}

}

function alert_(txt){ // for debugging
	console.log(txt); // works only with firebug
	
}
function blink(){ 
	var div = $("#cursor"); 
	if(div.css("display") == "none"){ 
		div.css("display","block");
	} else {
		div.css("display","none");
	}
}

function getMissions() {
// http://www.wait-till-i.com/2010/01/10/loading-external-content-with-ajax-using-jquery-and-yql/
// http://developer.yahoo.com/yql/guide/yql-code-examples.html
	var url = 'http://www.xrmx.co.uk/bookmarklets/hacktheplanet/missions.json';
	$.getJSON("http://query.yahooapis.com/v1/public/yql?"+
			  "q=select%20*%20from%20json%20where%20url%3D%22"+
			  encodeURIComponent(url)+
		      "%22&format=json'&callback=?",
			function(data){
				

				// if there is data, filter it and render it out
				if(data.results[0]){
				var data = filterData(data.results[0]);
				console.log(data);
				// otherwise tell the world that something went wrong
				} else {
				var errormsg = '<p>Error: could not load the page.</p>';
				console.log(errormsg);
				}
				/*console.log(data);
				if(data.results){
					console.log(data.results);
					//$.each(data.query.results.place, function(i, v) {
					//	console.log("woeid #" + i + ": " + v["woeid"]);
					//});

					var data = filterData(data.results[0]);
					console.log(data)
					//container.html(data);
				} else {
					var errormsg = '<p>Error: could not load the page.</p>';
					container.html(errormsg);
				}*/
			}
		
	);
}
function _getMissions() {
	// Work out current action points
	var url = 'http://www.xrmx.co.uk/bookmarklets/hacktheplanet/missions.json';
	$.getJSON(url,function(data) { 
		console.log(data);
		}
	);
	var	data = {};
	console.log('trying to get data');
	$.ajax({
		type: 'GET',
		url: url,
		data: data,
		dataType: "json"
	}).success(function (data) {

		console.log(data);

	});
	
}

// filter out some nasties
function filterData(data){
	//data = data.replace(/<?/body[^>]*>/g,'');
	data = data.replace(/[r|n]+/g,'');
	//data = data.replace(/<--[Ss]*?-->/g,'');
	//data = data.replace(/<noscript[^>]*>[Ss]*?</noscript>/g,'');
	//data = data.replace(/<script[^>]*>[Ss]*?</script>/g,'');
	//data = data.replace(/<script.*/>/,'');
	return data;
}
