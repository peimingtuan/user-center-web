/**
 * Created by Evan-Pei on 2020/3/13.
 */
export default function (msg) {
	if (!msg) return;
	let div = document.createElement('div')
	div.style.position = 'fixed'
	div.style.width = '70%'
	div.style.top = '40%'
	div.style.left = '15%'
	div.style.boxSizing = 'border-box';
	div.style.zIndex = 200
	div.style.padding = '5px'
	div.style.backgroundColor = 'rgba(0,0,0,0.8)'
	div.style.borderRadius = '3px'
	div.style.fontSize = '16px'
	div.style.color = '#fff'
	div.style.textAlign = 'center'
	div.appendChild(document.createTextNode(msg))
	document.body.appendChild(div)
	setTimeout(function(){
		document.body.removeChild(div)
	},2000)
}