import sequelize from '../config/database'
import { QueryTypes } from 'sequelize';
import { SideCharacterProfileWorkExperience } from '../models'
import { SideCharacterProfileWorkExperienceInput } from '../models/sideCharacterProfileWorkExperience'
import { isEmpty } from '../utils/helper';

export default class SideCharacterProfileWorkExperienceService {

	public getSideCharacProfileWorkExp = async (id: number): Promise<any> => {
		return SideCharacterProfileWorkExperience.findByPk(id)
	};

	public create = async (experience: SideCharacterProfileWorkExperienceInput[]): Promise<any> => {
		return SideCharacterProfileWorkExperience.bulkCreate(experience)
	}

	public destroy = async (filter: any): Promise<any> => {
		return SideCharacterProfileWorkExperience.destroy(filter);
	}

	public findByProfileId = async (filter: any): Promise<any> => {
		return SideCharacterProfileWorkExperience.findAll(filter);
	};

	public findById = async (id: number): Promise<any> => {
		return SideCharacterProfileWorkExperience.findByPk(id);
	};

	public update = async (payload: SideCharacterProfileWorkExperienceInput, filter: any): Promise<any> => {
		return SideCharacterProfileWorkExperience.update(payload, filter);
	};

	public createOrUpdate = async (experiencePayload: SideCharacterProfileWorkExperienceInput[]): Promise<any> => {
		return new Promise(async (resolve, reject) => {
			try {
				if (isEmpty(experiencePayload)) {
					resolve(experiencePayload);
				}
				for (const experience of experiencePayload) {
					if (experience.id == 0) {
						await this.create([experience]);
					} else {
						let filter = { where: { id: experience.id } }
						await this.update(experience, filter);
					}
				}
				let filter = { where: { side_character_profile_id: experiencePayload[0].side_character_profile_id } }
				let profileExperience = this.findByProfileId(filter);
				resolve(profileExperience);
			} catch (error) {
				reject(error);
			}
		})
	}
}