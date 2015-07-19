/**
 * CountryController
 *
 * @description :: Server-side logic for managing countries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find : find,

	/*
	post /country {"name","countryName"}
	*/
	create : addCountry,
	
	/*
	Update country in our case means add hotel to a country ;-)
	put /country/countryName {"hotel":"","info":""}
	*/
	update : addHotel,

	destroy : destroy,
	allCountries: allCountries,
	hotelsByCountry : hotelsByCountry,
	addCountry : addCountry,
	addHotel : addHotel,
	delHotel : delHotel,
	hotelInfo : hotelInfo,
	updHotel: updHotel,
	_404 : _404,

	_config : {
		blueprints: {
            actions: true,
            rest: true,
            shortcuts: true
        }
	} 
};
/*
	get /country?id=countryName
*/
function find(req, res) {
	var country = req.param('id')
	return res.send(Country.data[country]);
}

/*
	delete /country?id=countryName
*/
function destroy (req,res) {
	var countryName = req.param("id");
	for (var country in Country.data) {
		if (country == countryName){
			delete Country.data[country];
			return res.send({ status : "deleted successfully"});
		}
	}
}

function _404(req,res) {
	res.send(404, "Not Found" )
}

function allCountries(req, res){
	return res.send(Object.keys(Country.data));
}

function hotelsByCountry(req, res) {
	var country = req.param('name');
	if(Country.data.hasOwnProperty(country)) {
		var hotels = Country.data[country].hotels;
		return res.send(hotels);
	} else {
		return res.send({ status : "No such country"})
	}
}

function addCountry(req,res) {
	var countryName = req.body.name;
	if (countryName) {
		Country.data[req.body.name] = {};
		return res.send({ status : "added successfully"});
	} else {
		return res.send(400, { status : "Invalid request params"})	
	}
}

function addHotel(req,res) {
	var hotel = req.body.hotel;
	var info = req.body.info;
	var country = req.param('name') || req.param('id');
	
	if (!hotel || !info) {
		return res.send(400, { status : "Invalid request params"});
	} else {
		if (Country.data.hasOwnProperty(country)) {
			Country.data[country].hotels.push({
				'hotel': hotel,
				'info': info
			});
			return res.send({ status : "added successfully"});	
		} else{
			return res.send({ status : "No such country"})
		}
	}
}

function delHotel(req, res) {
	var hotel = req.param('name');
	var isFind = false;
	for (var country in Country.data) {
		Country.data[country].hotels.forEach( function (item,i,arr){
		if (item.name == hotel){
			arr.splice(i,1);
			isFind = true;
			return res.send({ status : "deleted successfully"});
		} 
	});
	}
	if (!isFind){
		return res.send({ status : "No such hotel"});
	}
}

function hotelInfo(req, res){
	var hotel = req.param('name'); 
	var isFind = false;
	for (var country in Country.data) {
		Country.data[country].hotels.forEach( function (item,i,arr){

		if (item.name == hotel){
			isFind = true
			return res.send(item['info']);
		}
		});
	}
	if (!isFind){
		return res.send({ status : "No such hotel"});
	}
}

function updHotel (req, res) {
	var hotel = req.param('name');
	var info = req.body.info;

	if (!hotel || !info) {
		return res.send(400, { status : "Invalid request params"});
	} else {
		for (var country in Country.data) {
			Country.data[country].hotels.forEach( function (item,i,arr){
				if (item.name == hotel){
					item['info'] = info;
					return res.send({ status : "updated successfully"});
				}
			});
		}
	}
}
