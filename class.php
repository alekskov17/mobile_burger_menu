<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();

use Bitrix\Main\Web;
use Bitrix\Main\Application;
use Bitrix\Main\Localization\Loc;
use Bitrix\Main\Engine\Contract\Controllerable;
use Bitrix\Main\Engine\ActionFilter;
use \Bitrix\Main\Data\Cache;

CModule::IncludeModule("iblock");
CModule::IncludeModule("krayt.emarket2");
Loc::loadMessages(__FILE__);


class CMuneBurger extends CBitrixComponent implements Controllerable
{

    /**
     * @return array
     */
    public function configureActions()
    {
        return [
            'getMenuTree' => [
                'prefilters' => [
                    new ActionFilter\HttpMethod(
                        array(ActionFilter\HttpMethod::METHOD_GET, ActionFilter\HttpMethod::METHOD_POST)
                    ),
                    new ActionFilter\Csrf(false),
                ],
                'postfilters' => []
            ]
        ];
    }
    public function onPrepareComponentParams($params)
    {
        \Krayt\Emarket2\Panel::getConfigComponent('krayt:main',$params);
        return $params;
    }
    protected function listKeysSignedParameters()
    {
        return [
            'IBLOCK_ID',
            'DEPTH_LEVEL',
            "CACHE_TIME"
        ];
    }

    public function executeComponent()
    {
            $arParamsHeader = [];
            \Krayt\Emarket2\Panel::getConfigComponent('krayt:header.menu',$arParamsHeader);

            if($arParamsHeader['K_HEADER_PERSONAL_LINK'])
            {
                $this->arParams['PERSONAL_PAGE_URL'] = $arParamsHeader['K_HEADER_PERSONAL_LINK'];
            }
            $this->getDopMenu();
            $this->getActionMenu();
            $this->includeComponentTemplate();

        return $this->arResult;
    }

    public function  getMenuTreeAction()
    {
        $cache = Cache::createInstance();
        if ($cache->initCache($this->arParams['CACHE_TIME'], "mobile_menu",'mobile_menu/')) {

            $SECTIONS = $cache->getVars();
        }
        elseif ($cache->startDataCache()) {

            $arFilter = array(
                "IBLOCK_ID"=>$this->arParams["IBLOCK_ID"],
                "GLOBAL_ACTIVE"=>"Y",
                "IBLOCK_ACTIVE"=>"Y",
                "<="."DEPTH_LEVEL" => $this->arParams["DEPTH_LEVEL"]??5,
            );

            $arOrder = array(
                "left_margin"=>"asc",
            );

            $rsSections = CIBlockSection::GetList($arOrder, $arFilter, false, array(
                "ID",
                "DEPTH_LEVEL",
                "NAME",
                "SECTION_PAGE_URL",
                "IBLOCK_SECTION_ID",
                "SORT",
                // CKrayt_emarket2::PROP_UF_BANNER_MENU,
                CKrayt_emarket2::PROP_UF_ICON,
            ));

            $rsSections->SetUrlTemplates("", $this->arParams["SEF_FOLDER"].$this->arParams["SEF_URL_TEMPLATES_section"]);
            $SECTIONS = [];
            while($arSection = $rsSections->GetNext())
            {
                $parent = $arSection['IBLOCK_SECTION_ID']??0;

                if($arSection['DEPTH_LEVEL'] == 1 && $arSection[CKrayt_emarket2::PROP_UF_ICON])
                {
                    $arSection['ICON'] = CFile::getPath($arSection[CKrayt_emarket2::PROP_UF_ICON]);
                }
                $arSection['IS_CHILD'] = false;
                $SECTIONS[$parent][] = $arSection;
            }
            if($SECTIONS)
            {
                foreach ($SECTIONS as $idP=>$section)
                {
                    if($section)
                    {
                        foreach ($section as $K=>$item)
                        {
                            $SECTIONS[$idP][$K]['SHOW'] = false;
                            if($SECTIONS[$item['ID']])
                            {
                                $SECTIONS[$idP][$K]['IS_CHILD'] = true;
                            }
                        }
                    }
                }
            }

            $cache->endDataCache($SECTIONS);
        }

        return ['section_tree' => $SECTIONS];
    }
    private function recursiveSection(&$child)
    {
        if($child)
        {
            usort($child, function ($item1, $item2) {
                return $item1['SORT'] <=> $item2['SORT'];
            });
            foreach ($child as &$childR)
            {
                $this->recursiveSection($childR['CHILD']);
            }
        }

    }
    private function getDopMenu()
    {
        ob_start();
        $this->includeComponentTemplate('dop_menu');
        $content = ob_get_contents();
        ob_end_clean();

        $this->arResult['DOP_MENU'] = $content;
    }
    private function getActionMenu()
    {
        ob_start();
        $this->includeComponentTemplate('action_menu');
        $content = ob_get_contents();
        ob_end_clean();
        $this->arResult['ACTION_MENU'] = $content;
    }
}
