<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
/** @var array $arParams */
/** @var array $arResult */
/** @global CMain $APPLICATION */
/** @global CUser $USER */
/** @global CDatabase $DB */
/** @var CBitrixComponentTemplate $this */
/** @var string $templateName */
/** @var string $templateFile */
/** @var string $templateFolder */
/** @var string $componentPath */
/** @var CBitrixComponent $component */

$this->setFrameMode(true);
?>
<? $APPLICATION->IncludeComponent(
    "krayt:krayt.sale.link",
    "",
    array(
        "MENU_CACHE_TIME" => "36000000",
        "MENU_CACHE_TYPE" => "A",
    ),
    $component
); ?>
