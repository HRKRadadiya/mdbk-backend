import { SideCharacterProfilePortfolio } from '../models'
import { sideCharacterProfilePortfolioInput, sideCharacterProfilePortfolioOutput } from '../models/sideCharacterProfilePortfolio'
import { removeFile } from '../utils/helper';

export default class SideCharacterProfilePortfolioService {

	public findById = async (id: number): Promise<any> => {
		return SideCharacterProfilePortfolio.findByPk(id)
	}

	public create = async (portfolio: sideCharacterProfilePortfolioInput[]): Promise<any> => {
		return SideCharacterProfilePortfolio.bulkCreate(portfolio)
	}

	public destroy = async (filter: any, portfolioImage: sideCharacterProfilePortfolioOutput): Promise<any> => {
		return SideCharacterProfilePortfolio.destroy(filter)
			.then(() => removeFile(portfolioImage.file_path));
	}

	public findByProfileId = async (filter: any): Promise<any> => {
		return await SideCharacterProfilePortfolio.findAll(filter);
	}
}