/*
 * Vinegar - Javascript <{Template Engine}>
 * @Copyright 2014 Active9 LLC.
 * VERSION: 1.0 RC2
 * SOURCE: https://github.com/active9/Vinegar/
 * LICENSE: MIT
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Active 9 LLC.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 */

var Vinegar = {

	/*
	 * Vinegar - define our template chemistry set
	 */
	node: typeof process !== "undefined" &&  {}.toString.call(process) === "[object process]",
	this: Vinegar,
	CH3: "<{",
	CH3enc: "&lt;{",
	COOH: "}>",
	COOHenc: "}&gt;",
	
	/*
	 * delimiter - sets the syntax dekunuterfor replacement
	 */
	delimiter: function(a,b) {
		this.CH3 = a;
		this.CH3enc = this.chars(a);
		this.COOH = b;
		this.COOHenc = this.chars(b);
	},

	/*
	 * templateuri - location of the template file with relative path
	 * datajson - array of data to pass to the template
	 *
	 */
	template: function(obj,datajson) {
		var templatedata;

		/*
		 * Document Body
		 */
		if (obj == document.body || obj == document) {
			templatedata = document.getElementsByTagName("body").innerHTML || document.body.innerHTML;
			obj = document.getElementsByTagName("body") || document.body;
			this.ferment(obj,templatedata,datajson);

		/*
		 * Object Array
		 */
		} else if (obj.length>1) {
			for (var i=0;i<obj.length;i++) {
				templatedata = obj[i].innerHTML;
				this.ferment(obj[i],templatedata,datajson);
			}

		/*
		 * Object
		 */
		} else {
			templatedata = obj.innerHTML;
			this.ferment(obj,templatedata,datajson);
		}
	},

	/* FERMENT - our metabolic process
	 *
	 * templatedata - the template data
	 * datajson - array of data to pass to the template
	 *
	 */
	ferment: function(obj,templatedata,datajson) {
		if (typeof templatedata != "string" || typeof datajson != "object") return;
		if (typeof obj != "object") return;
		if (templatedata.match(this.CH3+"*", "g") || templatedata.match(this.CH3enc+"*", "g")) {
			templatedata = this.metabolize(obj, templatedata, datajson);
		}
		return templatedata;
	},

	/* METABOLIZE - our metabolistic transformation
	 *
	 */
	metabolize: function(obje,templatedata,datajson) {
		var length = datajson.length;
		var s = 0;
		if(typeof datajson.length == "undefined") {
			datajson = JSON.parse(JSON.stringify(datajson));
			length = this.size(datajson);
			var s = -1;
		}
		for(var i=s;i<length;i++) {
			var obj = datajson[i];
			for(key in obj) {
				if (typeof obj[key] == "object") {
                			var lo = templatedata.match(new RegExp("\\t*"+this.CH3+"#"+key+this.COOH+"(||.*||\\s||\\s.*||.*\\s*||\\s.*\\s*||\\s*.*\\s*)"+this.CH3+"\\/"+key+this.COOH, "g")) || templatedata.match(new RegExp("\\t*"+this.CH3enc+"#"+key+this.COOHenc+"(||.*||\\s||\\s.*||.*\\s*||\\s.*\\s*||\\s*.*\\s*)"+this.CH3enc+"\\/"+key+this.COOHenc, "g"));
					if (lo) {
						var loobj = obj[key];
						for (var l=0;l<lo.length;l++) {
							var lkey = key;
							lo[0] = lo[0].replace(this.CH3+"#"+key+this.COOH, "");
							lo[0] = lo[0].replace(this.CH3enc+"#"+key+this.COOHenc, "");
							lo[0] = lo[0].replace(this.CH3+"/"+key+this.COOH, "");
							lo[0] = lo[0].replace(this.CH3enc+"/"+key+this.COOHenc, "");
							var looptemplate = lo[0];
							var templatedatax = "";
							for (var u=0;u<loobj.length;u++) {
								templatedatax += this.metabolize(null,looptemplate,[loobj[u]]);
							}
							templatedata = templatedata.replace(new RegExp("\\t*"+this.CH3+"#"+lkey+this.COOH+"(||.*||\\s||\\s.*||.*\\s*||\\s.*\\s*||\\s*.*\\s*)"+this.CH3+"\\/"+lkey+this.COOH, "g"), templatedatax);
							templatedata = templatedata.replace(new RegExp("\\t*"+this.CH3enc+"#"+lkey+this.COOHenc+"(||.*||\\s||\\s.*||.*\\s*||\\s.*\\s*||\\s*.*\\s*)"+this.CH3enc+"\\/"+lkey+this.COOHenc, "g"), templatedatax);
						}
                       			} else {
						for(var first in obj[key]) {
							templatedata = this.pair(templatedata, key, first);
							templatedata = this.metabolize(obje, templatedata, [obj[key]]);
						}
                    			}
				} else {
					templatedata = this.pair(templatedata, key, obj[key]);
				}
			}
		}
		templatedata = this.ethanol(obje,templatedata);
		return templatedata;
	},

	/*
	 * ETHANOL - mix our templatedata and object
	 */
	ethanol: function(obj,templatedata) {
		if (obj == document.getElementsByTagName("body") || obj == document.body) {
			document.body.innerHTML = templatedata;
		} else if (obj == null) {
			// Blank Output
		} else {
			obj.innerHTML = templatedata;
		}
		return templatedata;
	},

	/*
	 * BOND - replace our data bonds
	 */
	bond: function(text,replace,with_this) {
		return text.replace(new RegExp(replace, 'g'), with_this);
	},

	/*
	 * PAIR - replaces content on our metabolic pairs
	 */
	pair: function(templatedata, key, first) {
		templatedata = this.bond(templatedata, this.CH3enc+key+this.COOHenc, first);
		templatedata = templatedata.replace(this.CH3enc+"["+key+"]"+this.COOHenc, first);
		templatedata = this.bond(templatedata, this.CH3+key+this.COOH, first);
		templatedata = templatedata.replace(this.CH3+"["+key+"]"+this.COOH, first);
		return templatedata;
	},

	/*
	 * SIZE - find an objects size
	 */
	size: function(obj) {
		var s = 0;
		for (key in obj) {
			if(typeof obj == "object") s++;
		}
		return s;
	},

	/*
	 * CHARS - encodes a string to html chars
	 */
	chars: function(s) {
		var el = document.createElement("div");
		el.innerText = el.textContent = s;
		s = el.innerHTML;
		return s;
	}

}