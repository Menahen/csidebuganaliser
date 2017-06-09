module.exports.ManipuladorDOM = {
	criarLinhaErroLinx: function(erroLinx){
		 $("#corpoTabela").append("<tr style='height:20px;' id="+ 'tr' + erroLinx.numLinha +"> " +
						"<td width='10%'>Linha: "+erroLinx.numLinha+"</td> " +
						"<td width='50%' style='text-overflow: ellipsis;'><a data-role='hint' data-hint='"+erroLinx.linha+"' data-hint-position='top' data-hint-max-size=500>" + erroLinx.tipo + "</a></td> "+
						"<td width='20%' style='text-overflow: ellipsis;'>"+erroLinx.data+"</td>"+
						"<td width='10%' style='text-overflow: ellipsis;' data-role='hint' data-hint='"+erroLinx.mic+"' data-hint-position='top' data-hint-max-size=500>" + erroLinx.mic +"</td>" +
						"<td width='10%'>" +
							"<div class='toolbar'>" +
							    "<div class='toolbar-section'>"+
							        "<button class='toolbar-button' onclick='removerLinha(tr" + erroLinx.numLinha + ")'>"+
							        	"<span class='mif-bin fg-red' data-role='hint' "+
										    "data-hint-background='bg-green' "+
										    "data-hint-color='fg-white' " +
										    "data-hint-mode='1' "+
											    "data-hint='Remover|Remover erro'> " +
											  "</span>" +
							        "</button>"+
							        "<button class='toolbar-button' onclick='ignorarErro("+ JSON.stringify(erroLinx) +")'>"+
							        	"<span class='mif-warning fg-orange' data-role='hint' "+
											  "data-hint-background='bg-green' "+
											  "data-hint-color='fg-white' " +
												  "data-hint-mode='1' "+
												  "data-hint='Ignorar|Igonar erro'> " +
											"</span>"+
							        "</button>" +
							    "</div>" +
							"</div>" +
						"</td>" +
					"</tr>");
	},
	criarLinhaErroIgnorado: function(erroIgnorado, i){
		$("#corpoTabelaIgnorados").append("<tr id='tr"+i+"'>" +
			"<td>"+erroIgnorado.tipo+"</td>"+
			"<td>"+erroIgnorado.mic+"</td>"+
			"<td>"+erroIgnorado.linha+"</td>"+
			"<td width='10%'>" +
				"<div class='toolbar'>" +
				    "<div class='toolbar-section'>"+
				        "<button class='toolbar-button' onclick='removerLinha("+JSON.stringify(erroIgnorado)+", tr" +i+ ")'>"+
				        	"<span class='mif-bin fg-red' data-role='hint' "+
							    "data-hint-background='bg-green' "+
							    "data-hint-color='fg-white' " +
							    "data-hint-mode='1' "+
								    "data-hint='Remover|Remover erro'> " +
								  "</span>" +
				        "</button>"+
				    "</div>" +
				"</div>" +
			"</td>" +
			"</tr>");
	}
}