function lumens(technology, wattage) {
	if(technology == 'LED')
		return wattage * 100;
	if(technology == 'Halogen')
		return wattage * 15;
	if(technology == 'Incandescend')
		return wattage * 10;
	if(technology == 'Fluorescent')
		return wattage * 5;
}