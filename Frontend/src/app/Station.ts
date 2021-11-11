export class Station {
	private _id: number
	private _name: string
	private _latitude: number
	private _longitude: number


	get id() { return this._id }
	get name() { return this._name }
	get latitude() { return this._latitude }
	get longitude() { return this._longitude }
}
