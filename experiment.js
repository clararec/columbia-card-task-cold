/* ************************************ */
/* Traduccion de botones de los plugins */
/* ************************************ */
// Algunos botones vienen escritos en ingles dentro de los plugins de jsPsych
// (Next, Previous, End Instructions, Submit Answers). Este bloque los traduce
// apenas aparecen en pantalla, asi no hace falta modificar los plugins.
var traduccionBotones = {
	'Next': 'Siguiente',
	'Previous': 'Anterior',
	'End Instructions': 'Finalizar instrucciones',
	'Submit Answers': 'Enviar respuestas'
}
new MutationObserver(function() {
	$('button').each(function() {
		var t = $.trim($(this).text())
		if (traduccionBotones.hasOwnProperty(t)) {
			$(this).text(traduccionBotones[t])
		}
	})
}).observe(document.body, {childList: true, subtree: true})

/* ************************************ */
/* Define helper functions */
/* ************************************ */
var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

function assessPerformance() {
	var experiment_data = jsPsych.data.getTrialsOfType('single-stim-button')
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
	for (var i = 0; i < experiment_data.length; i++) {
		rt = experiment_data[i].rt
		trial_count += 1
		if (rt == -1) {
			missed_count += 1
		} else {
			rt_array.push(rt)
		}
	}
	//calculate average rt
	var avg_rt = -1
	if (rt_array.length !== 0) {
		avg_rt = math.median(rt_array)
	}
	var missed_percent = missed_count/experiment_data.length
  	credit_var = (missed_percent < 0.4 && avg_rt > 200)
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var,
									"performance_var": performance_var})
}

var appendTestData = function() {
	jsPsych.data.addDataToLastTrial({
		num_cards_chosen: currID,
		num_loss_cards: numLossCards,
		gain_amount: gainAmt,
		loss_amount: lossAmt,
		round_points: roundPointsArray.slice(-1),
		whichRound: whichRound
	})
}

var getButtons = function(buttonType) {
	var buttons = ""
	buttons = "<div class = allbuttons>"
	for (i = 0; i < 33; i++) {
		buttons += "<button type = 'button' class = 'CCT-btn chooseButton' id = " + i +
			" onclick = chooseButton(this.id)>" + i + "</button>"
	}
	return buttons
}

var getBoard = function(board_type) {
	var board = ''
	if (board_type == 2) {
		board = "<div class = cardbox>"
		for (i = 1; i < 33; i++) {
		board += "<div class = square><input type='image' class = card_image id = c" + i +
			" src='images/beforeChosen.png'></div>"
		}

	} else {
		board = "<div class = cardbox2>"
		for (i = 1; i < 33; i++) {
		board += "<div class = square><input class = card_image type='image' id = c" + i +
			" src='images/beforeChosen.png'></div>"
		}
	}
	board += "</div>"
	return board
}

var getText = function() {
	return '<div class = centerbox><p class = block-text>En total, obtuviste ' + totalPoints + ' puntos. Estos son los puntos que se usan para tu bonificación, a partir de tres rondas elegidas al azar:  ' +
		'<ul list-text><li>' + prize1 + '</li><li>' + prize2 + '</li><li>' + prize3 + '</li></ul>' +
		'</p><p class = block-text>Presioná <strong>Enter</strong> para continuar.</p></div>'
}

var turnOneCard = function(whichCard, win) {
	if (win === 'loss') {
		document.getElementById("c" + whichCard + "").src =
			'images/loss.png';
	} else {
		document.getElementById("c" + whichCard + "").src =
			'images/chosen.png';
	}
}

function doSetTimeout(card_i, delay, points, win) {
	CCT_timeouts.push(setTimeout(function() {
		turnOneCard(card_i, win);
		document.getElementById("current_round").innerHTML = 'Puntos de la ronda actual: ' + points
	}, delay));
}

function clearTimers() {
	for (var i = 0; i < CCT_timeouts.length; i++) {
		clearTimeout(CCT_timeouts[i]);
	}
}


var instructFunction = function() {
	$('#instructButton').prop('disabled', true)
	$('#jspsych-instructions-next').click(function() {
		for (var i = 0; i < CCT_timeouts.length; i++) {
			clearTimeout(CCT_timeouts[i]);
		}
	})

	$('#jspsych-instructions-back').click(function() {
		for (var i = 0; i < CCT_timeouts.length; i++) {
			clearTimeout(CCT_timeouts[i]);
		}
	})

	var cards_to_turn = [1, 17, 18, 15, 27, 31, 8]
	var total_points = 0
	var points_per_card = 10
	var delay = 0
	for (var i = 0; i < cards_to_turn.length; i++) {
		var card_i = cards_to_turn[i]
		delay += 250
		total_points += points_per_card
		doSetTimeout(card_i, delay, total_points, 'win')
	}
	CCT_timeouts.push(setTimeout(function() {
		document.getElementById("instruct1").innerHTML =
		'<strong>Ejemplo 1: </strong>En el ejemplo de abajo ves 32 cartas desconocidas. El panel te indica que 1 de esas cartas es una carta de pérdida. También te indica que dar vuelta cada carta de ganancia vale 10 puntos para vos, y que dar vuelta la carta de pérdida te costará 750 puntos. Supongamos que decidiste dar vuelta 7 cartas y después decidiste parar. Hacé clic en el botón "Ver resultado" para ver qué pasa: <font color = "red">Por suerte, ninguna de las siete cartas que diste vuelta resultó ser la carta de pérdida, así que tu puntaje en esta ronda fue 70. Hacé clic en el botón "Siguiente".</font>'
		}, delay))
}

var instructFunction2 = function() {
	$('#instructButton').prop('disabled', true)
	var tempArray = [3, 5, 6, 7, 9, 10, 11, 12, 19, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26,
		27, 28, 29, 31, 32
	]
	var instructTurnCards = function() {
		document.getElementById("8").src =
			'images/loss.png';
		document.getElementById("2").src =
			'images/loss.png';

		for (i = 0; i < tempArray.length; i++) {
			document.getElementById("" + tempArray[i] + "").src =
				'images/chosen.png';
		}
	}

	$('#jspsych-instructions-next').click(function() {
		for (var i = 0; i < CCT_timeouts.length; i++) {
			clearTimeout(CCT_timeouts[i]);
		}
	})

	$('#jspsych-instructions-back').click(function() {
		for (var i = 0; i < CCT_timeouts.length; i++) {
			clearTimeout(CCT_timeouts[i]);
		}
	})
	var cards_to_turn = [1, 4, 30]
	var total_points = 0
	var points_per_card = 30
	var delay = 0
	for (var i = 0; i < cards_to_turn.length; i++) {
		var card_i = cards_to_turn[i]
		delay += 250
		total_points += points_per_card
		doSetTimeout(card_i, delay, total_points, 'win')
	}
	delay += 250
	total_points -= 250
	doSetTimeout(13, delay, total_points, 'loss')
	CCT_timeouts.push(setTimeout(function() {
		document.getElementById("instruct2").innerHTML =
			'<strong>Ejemplo 2: </strong>En el ejemplo de abajo ves 32 cartas desconocidas. El panel te indica que 3 de esas cartas son cartas de pérdida. También te indica que dar vuelta cada carta de ganancia vale 30 puntos para vos, y que dar vuelta la carta de pérdida te costará 250 puntos. Supongamos que decidiste dar vuelta 10 cartas y después decidiste parar. Hacé clic en el botón "Ver resultado" para ver qué pasa: <font color = "red">Esta vez, la cuarta carta que diste vuelta fue una carta de pérdida. Como viste, la ronda termina inmediatamente cuando das vuelta una carta de pérdida. Habías ganado 90 puntos por las 3 cartas de ganancia y después se restaron 250 puntos por la carta de pérdida, así que tu puntaje en esta ronda fue -160. Una vez restados los puntos de pérdida del total de la ronda, la computadora también te mostró las cartas que todavía no habías dado vuelta. Hacé clic en el botón "Siguiente".</font>'
	}, delay))
	CCT_timeouts.push(setTimeout(instructTurnCards, delay + 1000))
}



var getPractice1 = function() {
	whichLossCards = [17]
	gainAmt = 30
	lossAmt = 250
	return practiceSetup1
}

var getPractice2 = function() {
	whichLossCards = [2,6,31]
	gainAmt = 10
	lossAmt = 750
	return practiceSetup2
}

var appendPayoutData = function(){
	jsPsych.data.addDataToLastTrial({reward: [prize1, prize2, prize3]})
}

var chooseButton = function(clicked_id) {
	$('#nextButton').prop('disabled', false)
	$('.chooseButton').prop('disabled', true)
	currID = parseInt(clicked_id)
	var roundPoints = 0
	var cards_to_turn = jsPsych.randomization.repeat(cardArray, 1).slice(0, currID)
	for (var i = 0; i < cards_to_turn.length; i++) {
		var card_i = cards_to_turn[i]
		if (whichLossCards.indexOf(card_i) == -1) {
			roundPoints += gainAmt
		} else {
			roundPoints -= lossAmt
			break
		}
	}
	roundPointsArray.push(roundPoints)
	if ($('#feedback').length) {
		document.getElementById("feedback").innerHTML =
			'<strong>Elegiste ' + clicked_id +
			' carta(s)</strong>. Cuando hagas clic en el botón "Siguiente ronda", empieza la próxima ronda. Tené en cuenta que el monto de pérdida, el monto de ganancia y la cantidad de cartas de pérdida pueden haber cambiado.'
	}
}

var instructButton = function(clicked_id) {
	currID = parseInt(clicked_id)
	document.getElementById(clicked_id).src =
		'images/chosen.png';
}

// appends text to be presented in the game
function appendTextAfter(input, search_term, new_text) {
	var index = input.indexOf(search_term) + search_term.length
	return input.slice(0, index) + new_text + input.slice(index)
}



// this function sets up the round params (loss amount, gain amount, which ones are loss cards, initializes the array for cards to be clicked, )
var getRound = function() {
	var currID = 0
	cardArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
		24, 25, 26, 27, 28, 29, 30, 31, 32
	]
	shuffledCardArray = jsPsych.randomization.repeat(cardArray, 1)
	whichRound = whichRound + 1
	randomChosenCards = []
	roundParams = shuffledParamsArray.pop()
	numLossCards = roundParams[0]
	gainAmt = roundParams[1]
	lossAmt = roundParams[2]
	whichLossCards = []
	for (i = 0; i < numLossCards; i++) {
		whichLossCards.push(shuffledCardArray.pop())
	}
	gameState = gameSetup
	// OJO: los textos de busqueda de abajo tienen que coincidir exactamente con las etiquetas de gameSetup
	gameState = appendTextAfter(gameState, 'Ronda: ', whichRound)
	gameState = appendTextAfter(gameState, 'Monto de pérdida: ', lossAmt)
	gameState = appendTextAfter(gameState, 'Cantidad de cartas de pérdida: ', numLossCards)
	gameState = appendTextAfter(gameState, 'Monto de ganancia: ', gainAmt)
	return gameState
}




/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true
var performance_var = 0

// task specific variables
var currID = 0
var numLossCards = 1
var gainAmt = ""
var lossAmt = ""
var points = []
var whichLossCards = [17]
var CCT_timeouts = []
var numRounds = 24
var whichRound = 0
var totalPoints = 0
var roundOver = 0
var roundPointsArray = []
var prize1 = 0
var prize2 = 0
var prize3 = 0

var practiceSetup1 =
	"<div class = practiceText><div class = block-text2 id = instruct1><strong>Práctica 1: </strong> Como se mencionó, en la versión del juego de cartas que vas a jugar no vas a dar vuelta las cartas de a una. En cambio, simplemente vas a elegir la cantidad total de cartas que querés dar vuelta (de 0 a 32) y después pasar a la siguiente ronda. Si dar vuelta cualquier carta te parece demasiado riesgoso, podés hacer clic en el botón cero; en ese caso, tu puntaje en esta ronda será automáticamente cero. Esta es una ronda de práctica y es igual al juego que vas a jugar. Elegí la cantidad de cartas que querés dar vuelta, según la cantidad de cartas de pérdida y los montos que podés ganar o perder al dar vuelta una carta de ganancia o de pérdida, como se muestra abajo. Tené en cuenta que la computadora te va a decir cómo te fue después de que terminen las " + numRounds + " rondas del juego.</div></div>" +
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text id = game_round>Ronda: 1</div></div>   <div class = titleboxLeft1><div class = center-text id = loss_amount>Monto de pérdida: 250</div></div>    <div class = titleboxMiddle1><div class = center-text id = gain_amount>Monto de ganancia: 30</div></div>    <div class = titlebox><div class = center-text>¿Cuántas cartas querés dar vuelta? </div></div>     <div class = titleboxRight1><div class = center-text id = num_loss_cards>Cantidad de cartas de pérdida: 1</div></div>"+
	"<div class = buttonbox><button type='button' id = nextButton class = 'CCT-btn select-button' onclick = clearTimers() disabled>Siguiente ronda</button></div>"+
	getButtons()+
	"</div>"+
	getBoard()



var practiceSetup2 =
 	"<div class = practiceText><div class = block-text2 id = instruct2><strong>Práctica 2: </strong> La computadora va a registrar tus puntos en cada ronda y te va a mostrar el total cuando termines las " + numRounds + " rondas del juego. Esta es la segunda ronda de práctica. Elegí nuevamente tantas cartas como quieras, según la cantidad de cartas de pérdida y los montos que podés ganar o perder al dar vuelta una carta de ganancia o de pérdida, como se muestra abajo.</div></div>"+
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text id = game_round>Ronda: 2</div></div>   <div class = titleboxLeft1><div class = center-text id = loss_amount>Monto de pérdida: 750</div></div>    <div class = titleboxMiddle1><div class = center-text id = gain_amount>Monto de ganancia: 10</div></div>    <div class = titlebox><div class = center-text>¿Cuántas cartas querés dar vuelta? </div></div>     <div class = titleboxRight1><div class = center-text id = num_loss_cards>Cantidad de cartas de pérdida: 3</div></div>"+
	"<div class = buttonbox><button type='button' id = nextButton class = 'CCT-btn select-button' onclick = clearTimers() disabled>Siguiente ronda</button></div>"+
	getButtons()+
	"</div>"+
	getBoard()


// this params array is organized such that the 0 index = the number of loss cards in round, the 1 index = the gain amount of each happy card, and the 2nd index = the loss amount when you turn over a sad face
var paramsArray = [
	[1, 10, 250],
	[1, 10, 750],
	[1, 30, 250],
	[1, 30, 750],
	[3, 10, 250],
	[3, 10, 750],
	[3, 30, 250],
	[3, 30, 750]
]

var cardArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
	24, 25, 26, 27, 28, 29, 30, 31, 32
]

var shuffledCardArray = jsPsych.randomization.repeat(cardArray, 1)
var shuffledParamsArray = jsPsych.randomization.repeat(paramsArray, numRounds/8)


var gameSetup =
	"<div class = practiceText><div class = block-text2 id = feedback></div></div>" +
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text id = game_round>Ronda: </div></div>   <div class = titleboxLeft1><div class = center-text id = loss_amount>Monto de pérdida: </div></div>    <div class = titleboxMiddle1><div class = center-text id = gain_amount>Monto de ganancia: </div></div>    <div class = titlebox><div class = center-text>¿Cuántas cartas querés dar vuelta? </div></div>     <div class = titleboxRight1><div class = center-text id = num_loss_cards>Cantidad de cartas de pérdida: </div></div>" +
	"<div class = buttonbox><button type='button' id = nextButton class = 'CCT-btn select-button' onclick = clearTimers() disabled>Siguiente ronda</button></div>"+
	getButtons()+
	"</div>"+
	getBoard()



/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Resumí con tus palabras qué se te pidió hacer en esta tarea.</p>',
              '<p class = center-block-text style = "font-size: 20px">¿Tenés algún comentario sobre esta tarea?</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var feedback_instruct_text =
	'Te damos la bienvenida al experimento. Esta tarea dura alrededor de 15 minutos. Presioná <strong>Enter</strong> para comenzar.'
var feedback_instruct_block = {
	type: 'poldrack-text',
	cont_key: [13],
	data: {
		trial_id: 'instruction'
	},
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []
var instructions_block = {
  type: 'poldrack-instructions',
  data: {trial_id: 'instruction'},
  pages: [
	'<div class = centerbox><p class = block-text><strong>Introducción y explicación</strong>'+
	'<p>-Ahora vas a participar en un juego de cartas. En este juego vas a dar vuelta cartas para ganar o perder puntos, que valen dinero.</p>'+
	'<p>-En cada ronda del juego vas a ver 32 cartas en la pantalla de la computadora, boca abajo. Vas a decidir cuántas de esas cartas querés dar vuelta. Cada carta es una carta de ganancia o una carta de pérdida (no hay cartas neutras). Vas a saber cuántas cartas de ganancia y cuántas cartas de pérdida hay entre las 32, y cuántos puntos vas a ganar o perder si das vuelta una carta de ganancia o una carta de pérdida. Lo que no sabés es cuáles de las 32 cartas que ves boca abajo son de ganancia y cuáles son de pérdida. </p>'+
	'<p>-Indicás la cantidad de cartas (de 0 a 32) que querés dar vuelta haciendo clic en un botón pequeño. No vas a ver las cartas dadas vuelta: el juego va a seleccionar un conjunto aleatorio de cartas, de la cantidad que elegiste, y las va a "dar vuelta" sin que lo veas. Por cada carta de ganancia que se da vuelta, se suman puntos al total de tu ronda y se da vuelta otra carta. Esto continúa hasta que aparece una carta de pérdida o hasta que se alcanza la cantidad de cartas que elegiste. La primera vez que se da vuelta una carta de pérdida, los puntos de pérdida se restan de tu total actual y la ronda termina, incluso si habías indicado que se dieran vuelta más cartas. El total acumulado será tu puntaje de esa ronda, y pasás a la siguiente. Cada ronda nueva empieza con 0 puntos; es decir, jugás cada ronda de forma independiente de las demás.</p>'+
	'<p>-Vas a jugar un total de ' + numRounds + ' rondas, de las cuales tres se elegirán al azar al final de la sesión, y vas a recibir un pago adicional proporcional a esas rondas.</p>',

    '<div class = centerbox><p class = block-text><strong>Cartas desconocidas:</strong>'+
    '<p> Así se ve una carta desconocida. Dala vuelta haciendo clic sobre ella.</p>'+
    "<p><input type='image' id = '133' src='images/beforeChosen.png' onclick = instructButton(this.id)>"+
	'</p></div>',

	'<div class = centerbox><p class = block-text>'+
	'<p><strong>La carta de ganancia:</strong></p>'+
	'<p>Por cada carta de ganancia que des vuelta, tu puntaje aumenta 10 o 30 puntos, según la ronda.</p>'+
	"<p><input type='image' src='images/chosen.png'>"+
	'<p><strong>La carta de pérdida:</strong></p>'+
	"<p><input type='image' src='images/loss.png'></p>"+
	'<p>Por cada carta de pérdida que des vuelta, tu puntaje disminuye 250 o 750 puntos, según la ronda. Además, la ronda termina de inmediato (no podés dar vuelta más cartas). En cada ronda habrá 1 o 3 cartas de pérdida.</p>'+
	'<p>La cantidad de cartas de pérdida y la cantidad de puntos que se pueden ganar o perder al dar vuelta una carta de ganancia o una carta de pérdida son fijas en cada ronda. Esta información va a estar siempre a la vista, para que sepas en qué tipo de ronda estás.</p>'+
	'</p></div>',

	"<div class = practiceText><div class = block-text2 id = instruct1><strong>Ejemplo 1: </strong>En el ejemplo de abajo ves 32 cartas desconocidas. El panel te indica que 1 de esas cartas es una carta de pérdida. También te indica que dar vuelta cada carta de ganancia vale 10 puntos para vos, y que dar vuelta la carta de pérdida te costará 750 puntos. Supongamos que decidiste dar vuelta 7 cartas y después decidiste parar. Hacé clic en el botón 'Ver resultado' para ver qué pasa:</div></div>"+
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text>Ronda: 1</div></div>   <div class = titleboxLeft1><div class = center-text>Monto de pérdida: 750</div></div>    <div class = titleboxMiddle1><div class = center-text>Monto de ganancia: 10</div></div>    <div class = titlebox><div class = center-text>¿Cuántas cartas querés dar vuelta? </div></div>     <div class = titleboxRight1><div class = center-text>Cantidad de cartas de pérdida: 1</div></div>   <div class = titleboxRight><div class = center-text id = current_round>Puntos de la ronda actual: 0</div></div>"+
	"<div class = buttonbox><button type='button' class = CCT-btn id = instructButton onclick= instructFunction()>Ver resultado</button></div></div>"+
	getBoard(2),

	"<div class = practiceText><div class = block-text2 id = instruct2><strong>Ejemplo 2: </strong>En el ejemplo de abajo ves 32 cartas desconocidas. El panel te indica que 3 de esas cartas son cartas de pérdida. También te indica que dar vuelta cada carta de ganancia vale 30 puntos para vos, y que dar vuelta la carta de pérdida te costará 250 puntos. Supongamos que decidiste dar vuelta 10 cartas y después decidiste parar. Hacé clic en el botón 'Ver resultado' para ver qué pasa:</div></div>"+
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text>Ronda: 1</div></div>   <div class = titleboxLeft1><div class = center-text>Monto de pérdida: 250</div></div>    <div class = titleboxMiddle1><div class = center-text>Monto de ganancia: 30</div></div>    <div class = titlebox><div class = center-text>¿Cuántas cartas querés dar vuelta? </div></div>     <div class = titleboxRight1><div class = center-text>Cantidad de cartas de pérdida: 3</div></div>   <div class = titleboxRight><div class = center-text id = current_round>Puntos de la ronda actual: 0</div></div>"+
	"<div class = buttonbox><button type='button' class = CCT-btn id = instructButton onclick= instructFunction2()>Ver resultado</button></div></div>"+
	getBoard(2),
	"<div class = centerbox><p class = block-text>A diferencia de esos ejemplos, en la versión del juego de cartas que vas a jugar no vas a dar vuelta las cartas de a una. En cambio, simplemente vas a elegir la cantidad total de cartas que querés dar vuelta (de 0 a 32) y después pasar a la siguiente ronda. Vamos a hacer dos rondas de práctica para asegurarnos de que esto quede claro. Antes de continuar, asegurate de haber entendido los ejemplos de las dos últimas páginas.</p></div>"
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};
instruction_trials.push(feedback_instruct_block)
instruction_trials.push(instructions_block)

var instruction_node = {
	timeline: instruction_trials,
	/* This function defines stopping criteria */
	loop_function: function(data) {
		for (i = 0; i < data.length; i++) {
			if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
				rt = data[i].rt
				sumInstructTime = sumInstructTime + rt
			}
		}
		if (sumInstructTime <= instructTimeThresh * 1000) {
			feedback_instruct_text =
				'Leíste las instrucciones demasiado rápido. Tomate tu tiempo y asegurate de haberlas entendido. Presioná <strong>Enter</strong> para continuar.'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = 'Terminaste con las instrucciones. Presioná <strong>Enter</strong> para continuar.'
			return false
		}
	}
}

var end_instructions = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><p class = center-block-text><strong>Fin de las instrucciones </strong></p><p class = center-block-text>Presioná <strong>Enter</strong> cuando quieras empezar a jugar.</p></div>',
	is_html: true,
	data: {
		trial_id: 'end_instructions'
	},
	choices: [13],
	timing_post_trial: 0,
	response_ends_trial: true,
};

var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'end',
		exp_id: 'columbia_card_task_cold'
	},
	text: '<div class = centerbox><p class = center-block-text>Terminaste esta tarea.</p><p class = center-block-text>Presioná <strong>Enter</strong> para continuar.</p></div>',
	cont_key: [13],
	timing_post_trial: 0,
  	on_finish: assessPerformance
};

var start_practice_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'practice_intro'
	},
	text: '<div class = centerbox><p class = center-block-text>Hello<strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'test_intro'
	},
	text: '<div class = centerbox><p class = center-block-text>We will now start the test. Respond to the "X" as quickly as possible by pressing the spacebar. Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var practice_block1 = {
	type: 'single-stim-button',
	button_class: 'select-button',
	stimulus: getPractice1,
	is_html: true,
	data: {
		trial_id: 'stim',
		exp_stage: 'practice'
	},
	timing_post_trial: 0,
	response_ends_trial: true,
	on_finish: function() {
		appendTestData()
		roundOver = 0
		currTrial = 0
		whichRound = 0
		numLossCards = 3
	}
};

var practice_block2 = {
	type: 'single-stim-button',
	button_class: 'select-button',
	stimulus: getPractice2,
	is_html: true,
	data: {
		trial_id: 'stim',
		exp_stage: 'practice'
	},
	timing_post_trial: 0,
	response_ends_trial: true,
	on_finish: function() {
		appendTestData()
		roundOver = 0
		currTrial = 0
		whichRound = 0
		roundPointsArray = []
	}
};

var test_block = {
	type: 'single-stim-button',
	button_class: 'select-button',
	stimulus: getRound,
	data: {
		trial_id: 'stim',
		exp_stage: 'test'
	},
	timing_post_trial: 0,
	on_finish: appendTestData,
	response_ends_trial: true,
};

var payout_text = {
	type: 'poldrack-text',
	text: getText,
	data: {
		trial_id: 'reward'
	},
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: appendPayoutData,
};

var payoutTrial = {
	type: 'call-function',
	data: {
		trial_id: 'calculate reward'
	},
	func: function() {
		totalPoints = math.sum(roundPointsArray)
		randomRoundPointsArray = jsPsych.randomization.repeat(roundPointsArray, 1)
		prize1 = randomRoundPointsArray.pop()
		prize2 = randomRoundPointsArray.pop()
		prize3 = randomRoundPointsArray.pop()
		performance_var = prize1 + prize2 + prize3
	}
};



/* create experiment definition array */
var columbia_card_task_cold_experiment = [];
columbia_card_task_cold_experiment.push(instruction_node);
columbia_card_task_cold_experiment.push(practice_block1);
columbia_card_task_cold_experiment.push(practice_block2);
columbia_card_task_cold_experiment.push(end_instructions)
for (b = 0; b < numRounds; b++) {
	columbia_card_task_cold_experiment.push(test_block);
}
columbia_card_task_cold_experiment.push(payoutTrial);
columbia_card_task_cold_experiment.push(payout_text);
columbia_card_task_cold_experiment.push(post_task_block)
columbia_card_task_cold_experiment.push(end_block);
