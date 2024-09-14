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
<?php
use Bitrix\Main\Localization\Loc;
$this->setFrameMode(true);
$uniqueId = md5($this->randString());
?>
<div id="block_vue_menu_burger">
</div>
<script  type="text/javascript">
    new JSKraytVueMenuBurger({
        uniqueId:'block_vue_menu_burger<?=$uniqueId?>',
        signedParameters:'<?=$this->getComponent()->getSignedParameters()?>',
        K_BACK: "<?=Loc::getMessage('K_BACK')?>",
        K_AUTH: "<?=Loc::getMessage('K_AUTH')?>",
        HTML_DOP_MENU: `<?=$arResult['DOP_MENU']?>`,
        HTML_ACTION_MENU: `<?=$arResult['ACTION_MENU']?>`,
        PERSONAL_PAGE_URL: `<?=$arParams['PERSONAL_PAGE_URL']?>`,
    });
</script>