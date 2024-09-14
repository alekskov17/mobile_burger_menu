<?
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();

$arComponentDescription = array(
	"NAME" => GetMessage("K_MENU_BURGER_NAME"),
	"DESCRIPTION" => GetMessage("K_MENU_BURGER_NAME_DESC"),
	"ICON" => "/images/sale_account.gif",
	"PATH" => array(
		"ID" => "Krayt",
		"CHILD" => array(
			"ID" => "menu_burger",
			"NAME" => GetMessage("K_GROUP")
		)
	),
);
?>