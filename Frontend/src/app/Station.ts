export class Station {
	private _id: number | null
	private _name: string | null
	private _latitude: number | null
	private _longitude: number | null


	get id() { return this._id }
	get name() { return this._name }
	get latitude() { return this._latitude }
	get longitude() { return this._longitude }
}
