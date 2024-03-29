export const creatorSQL = `
    drop table if exists IndustrialBuilding;
    drop table if exists IndustrialBuildings;
    drop table if exists Item;
    drop table if exists Translations;

    BEGIN TRANSACTION;

    CREATE TABLE Translations ("key" TEXT PRIMARY KEY, lang TEXT, translation TEXT);
    INSERT INTO Translations VALUES('waterDesc','en','One liter of water.');
    INSERT INTO Translations VALUES('neoLeadDesc','en','A super dense material used for radiation shielding. This invention made possible the exploration of the lava sea. (Patent Pending, nr.25011562556454565-f)');
    INSERT INTO Translations VALUES('oilDesc','en','All kinds of oils and lubricants.');
    INSERT INTO Translations VALUES('plasticDesc','en','All kinds of plastic needed by the modern industry');
    INSERT INTO Translations VALUES('metalIngotsDesc','en','All kinds of metal needed by the modern industry');
    INSERT INTO Translations VALUES('bricksDesc','en','Bricks. Simple as that.');
    INSERT INTO Translations VALUES('neoAsbestDesc','en','Despite the name, this is not an asbest based product, but one of the newest petrochemical wonders. This invention made survival in the Lava Sea possible.');
    INSERT INTO Translations VALUES('plutoniumDesc','en','A new and more potent kind of fuel. It has no much applications yet, but the science community is very interested.');
    INSERT INTO Translations VALUES('refinedUraniumDesc','en','Refined and ready for usage.');
    INSERT INTO Translations VALUES('uranOreDesc','en','The raw form of uranium. Needs to be refined before you can put it into your favorite reactor.');
    INSERT INTO Translations VALUES('preciousMineralsDesc','en','Diamonds, rubies, smaragds. Not just as jewelry, the modern industry requires these as well.');
    INSERT INTO Translations VALUES('silverDesc','en','Silver. Not just for self decoration purposes, but for advanced electronics as well.');
    INSERT INTO Translations VALUES('goldDesc','en','Gold. Not just for self decoration purposes, but for advanced electronics as well. Pirates love it, maybe too much.');
    INSERT INTO Translations VALUES('luxClothesDesc','en','Luxury clothes.');
    INSERT INTO Translations VALUES('basicWorkClothesDesc','en','Basic everyday work clothes.');
    INSERT INTO Translations VALUES('basicClothesDesc','en','Basic everyday clothes.');
    INSERT INTO Translations VALUES('luxuryFoodDesc','en','A packet of exquisite delicacies.');
    INSERT INTO Translations VALUES('goodFoodDesc','en','An assortment food packet for a healthy diet.');
    INSERT INTO Translations VALUES('basicFoodDesc','en','Basic food packet, mostly poor people and mutants eat it.');
    INSERT INTO Translations VALUES('mysteriousMachinery','en','Mysterious machinery');
    INSERT INTO Translations VALUES('mysteriousArtifacts','en','Mysterious artifacts');
    INSERT INTO Translations VALUES('appliances','en','Household appliances');
    INSERT INTO Translations VALUES('advMedicaments','en','Advanced medicaments');
    INSERT INTO Translations VALUES('medicaments','en','Medicaments');
    INSERT INTO Translations VALUES('sidearm','en','Sidearm');
    INSERT INTO Translations VALUES('pecussionRifleAmmo','en','Percussion rifle ammo kits');
    INSERT INTO Translations VALUES('cartridgeAmmo','en','Cartridge ammo');
    INSERT INTO Translations VALUES('weaponParts','en','Weapon parts');
    INSERT INTO Translations VALUES('submachineGun','en','Light, mini handheld machine gun');
    INSERT INTO Translations VALUES('machinegun','en','Machinegun');
    INSERT INTO Translations VALUES('boltActionCarbine','en','Bolt action carbine');
    INSERT INTO Translations VALUES('needleGun','en','Needle action carbine');
    INSERT INTO Translations VALUES('blunderbuss','en','Blunderbuss musket');
    INSERT INTO Translations VALUES('neoLoead','en','Neo Lead');
    INSERT INTO Translations VALUES('oil','en','Oil');
    INSERT INTO Translations VALUES('polymerDesc','en','Polymer');
    INSERT INTO Translations VALUES('metalIngot','en','Metal ingots');
    INSERT INTO Translations VALUES('bricks','en','Bricks');
    INSERT INTO Translations VALUES('neoAsbest','en','Neo asbest');
    INSERT INTO Translations VALUES('plutonium','en','Refined plutonium');
    INSERT INTO Translations VALUES('refinedUranium','en','Refined uranium');
    INSERT INTO Translations VALUES('uraniumOre','en','Uranium ore');
    INSERT INTO Translations VALUES('preciousMinerals','en','Precious minerals');
    INSERT INTO Translations VALUES('silver','en','Silver');
    INSERT INTO Translations VALUES('gold','en','Gold');
    INSERT INTO Translations VALUES('luxClothes','en','Luxury clothing');
    INSERT INTO Translations VALUES('workClothes','en','Work clothing');
    INSERT INTO Translations VALUES('basicClothes','en','Basic clothing');
    INSERT INTO Translations VALUES('water','en','Water');
    INSERT INTO Translations VALUES('mre','en','MRE packet');
    INSERT INTO Translations VALUES('luxuryFood','en','Luxurious food');
    INSERT INTO Translations VALUES('goodFood','en','Good quality food');
    INSERT INTO Translations VALUES('basicFood','en','Basic food');
    INSERT INTO Translations VALUES('hydroponic farm','en','Hydroponic farm');
    INSERT INTO Translations VALUES('waterPurificator','en','Water purificator');
    INSERT INTO Translations VALUES('artificalFoodFactory','en','Artificial food factory');
    INSERT INTO Translations VALUES('mreDesc','en','one day of sustanance. Don\''t forget drink a lot before, after and while you are eating it.');
    INSERT INTO Translations VALUES('blunderbussDesc','en','An old type, black powder based, obsolete firearm. Despite this fact, it is a popular budget solution for home defense and security sidearm purposes, but it is the most usefull, when never get fired.');
    INSERT INTO Translations VALUES('needleGunDesc','en','A very basic rifle. It has a good range, precise and also relatively cheap. Not a good choise for the Lava Sea though, because the paper cartridges don\''t like the climate in the harsher sectors.');
    INSERT INTO Translations VALUES('machinegunDesc','en','A big, bulky gun with impressive firepower. The queen of the battlefield.');
    INSERT INTO Translations VALUES('submachineGunDesc','en','Despite the name, this is more like a high capacity, self loading pistol, with atroticous accuarcy. Even the brightest military minds struggle to find an apllication for it, maybe when the battlefields became only a few hundred meters long.');
    INSERT INTO Translations VALUES('weaponPartsDesc','en','Varius weapon small parts. They come in labeled boxes, for the joy of your armourer.');
    INSERT INTO Translations VALUES('cartridgeAmmoDesc','en','Various ammo in many calibers.');
    INSERT INTO Translations VALUES('pecussionRifleAmmoDesc','en','Contains everything you need for your own ammunition for your paper cartridge rifles. Powder, paper, caps and bullets.');
    INSERT INTO Translations VALUES('pirateSabreDesc','en','An ugly, heavy blade used by pirates.');
    INSERT INTO Translations VALUES('pirateSabre','en','Pirate sabre');
    INSERT INTO Translations VALUES('officerSwordDesc','en','A high quality sword worthy for any officer to use.');
    INSERT INTO Translations VALUES('officerSword','en','Officer sword');
    INSERT INTO Translations VALUES('sidearmDesc','en','A small self defense weapon for military officers, and vigilant civilians.');
    INSERT INTO Translations VALUES('advMedicamentsDesc','en','Medication for rare illnesses.');
    INSERT INTO Translations VALUES('medicamentsDesc','en','Medication for common illnesses.');
    INSERT INTO Translations VALUES('appliancesDesc','en','Everything from coffee grinders to bathtubs.');
    INSERT INTO Translations VALUES('mysteriousArtifactsDesc','en','Some strange items. The scientific community is certainly interested in these.');
    INSERT INTO Translations VALUES('mysteriousMachineryDesc','en','Some strange, yet familiar machines. Can range from oil pumps to electronic converters. The scientific community is certainly interested in these.');

    CREATE TABLE IndustrialBuilding (ID INTEGER PRIMARY KEY, nameKey TEXT, dailyOutput INTEGER);
    INSERT INTO IndustrialBuilding VALUES(1,'artificalFoodFactory',NULL);
    INSERT INTO IndustrialBuilding VALUES(2,'waterPurificator',NULL);
    INSERT INTO IndustrialBuilding VALUES(3,'hidrophonic farm',NULL);

    CREATE TABLE Item (ID INTEGER PRIMARY KEY AUTOINCREMENT, startPrice INTEGER, endPrice INTEGER, nameKey TEXT, descriptionKey TEXT, category INTEGER, weight INTEGER);
    INSERT INTO Item VALUES(1,10,10,'water','waterDesc',0, 1);
    INSERT INTO Item VALUES(2,10,10,'luxuryFood','luxuryFoodDesc',0,1);
    INSERT INTO Item VALUES(3,10,10,'luxClothes','luxClothesDesc',0,1);
    INSERT INTO Item VALUES(4,10,20,'basicFood','basicFoodDesc',0,1);
    INSERT INTO Item VALUES(5,10,10,'mre','mre',0,1);
    INSERT INTO Item VALUES(6,10,10,'goodFood','goodFoodDesc',0,1);
    INSERT INTO Item VALUES(7,10,10,'basicClothes','basicClothesDesc',0,5);
    INSERT INTO Item VALUES(8,10,10,'workClothes','workClothes',0,5);
    INSERT INTO Item VALUES(9,10,10,'gold','goldDesc',2,1);
    INSERT INTO Item VALUES(10,10,10,'silver','silverDesc',2,1);
    INSERT INTO Item VALUES(11,10,10,'preciousMinerals','preciousMineralsDesc',2,1);
    INSERT INTO Item VALUES(12,10,10,'uraniumOre','uranOreDesc',2,1000);
    INSERT INTO Item VALUES(13,20,10,'refinedUranium','refinedUraniumDesc',2,1);
    INSERT INTO Item VALUES(14,10,10,'neoAsbest','neoAsbestDesc',2,1000);
    INSERT INTO Item VALUES(15,21,10,'bricks','bricksDesc',2,1000);
    INSERT INTO Item VALUES(16,20,20,'metalIngot','metalIngotsDesc',2,1000);
    INSERT INTO Item VALUES(17,10,10,'oil','oilDesc',2,1000);
    INSERT INTO Item VALUES(18,10,10,'neoLoead','neoLeadDesc',1,1000);
    INSERT INTO Item VALUES(19,10,10,'blunderbuss','blunderbuss',1,8);
    INSERT INTO Item VALUES(20,10,10,'needleGun','needleGun',3,6);
    INSERT INTO Item VALUES(21,10,10,'medicaments','medicaments',0,1);
    INSERT INTO Item VALUES(22,10,10,'advMedicaments','advMedicaments',0,1);
    INSERT INTO Item VALUES(23,10,10,'appliances','appliancesDesc',0,10);

    CREATE TABLE IndustrialBuildings (ID INTEGER PRIMARY KEY AUTOINCREMENT, num INTEGER, IndustrialBuilding INTEGER, city INTEGER);
    INSERT INTO IndustrialBuildings VALUES(1,1,1,1);
    INSERT INTO IndustrialBuildings VALUES(2,2,2,1);
    INSERT INTO IndustrialBuildings VALUES(3,1,3,1);
    
    DELETE FROM sqlite_sequence;
    COMMIT;
`;
